import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import XLSX from 'xlsx';

// ETL utilities.
import ensureExtensions from '@eubfr/lib/etl/ensureExtensions';
import extractMessage from '@eubfr/lib/etl/extractMessage';
import handleError from '@eubfr/lib/etl/handleError';

import MessengerFactory from '@eubfr/logger-messenger/src/lib/MessengerFactory';
import { STATUS } from '@eubfr/logger-messenger/src/lib/status';

import transformRecord from '../lib/transform';

export const handler = async (event, context) => {
  const { BUCKET, REGION, STAGE } = process.env;

  if (!BUCKET || !REGION || !STAGE) {
    throw new Error(
      'BUCKET, REGION and STAGE environment variables are required!'
    );
  }

  try {
    const snsMessage = extractMessage(event);
    const { key } = snsMessage.object;

    if (!ensureExtensions({ file: key, extensions: ['.xls', '.xlsx'] })) {
      throw new Error('XLS or XLSX file expected for this ETL.');
    }

    const messenger = MessengerFactory.Create({ context });
    const s3 = new AWS.S3();

    await messenger.send({
      message: {
        computed_key: key,
        status_message: 'Start parsing XLS...',
        status_code: STATUS.PARSING,
      },
      to: ['logs'],
    });

    // Get file
    const readStream = s3
      .getObject({ Bucket: snsMessage.bucket.name, Key: key })
      .createReadStream();

    return new Promise((resolve, reject) => {
      // Put data in buffer
      const buffers = [];

      readStream.on('data', data => {
        buffers.push(data);
      });

      readStream.on('error', async e =>
        handleError(
          { messenger, key, statusCode: STATUS.ERROR },
          { error: e, callback: reject }
        )
      );

      // Manage data
      readStream.on('end', async () => {
        let dataString = '';
        // stores raw, aggregated version of records from rows.
        const recordsAgg = [];

        const separator = ';';
        const mergeFields = [
          'Beneficiary name / Nom du bénéficiaire',
          'Country / Pays',
          'Total eligible expenditure allocated to the operation / Montant total éligible attribué au projet',
          "Union co-financing rate as per priority axes / Taux de cofinancement de l'UE selon le statut du bénéficiaire",
          'Operation post code / Code postal',
          'Country / Pays',
        ];

        // Parse file
        const buffer = Buffer.concat(buffers);

        const workbook = XLSX.read(buffer, {
          cellDates: true,
          dateNF: 'dd.mm.yyyy',
        });

        const sheetNameList = workbook.SheetNames;
        const records = XLSX.utils.sheet_to_json(
          workbook.Sheets[sheetNameList[0]]
        );

        records.forEach(record => {
          const indexExisting = recordsAgg.findIndex(
            needle =>
              needle['Operation name / Acronyme du projet'] ===
              record['Operation name / Acronyme du projet']
          );

          // If not present yet.
          if (indexExisting === -1) {
            recordsAgg.push(record);
          }
          // If there's an existing object with that name, we have to update it.
          else {
            const existing = recordsAgg.splice(indexExisting, 1)[0];

            mergeFields.forEach(field => {
              // Concatenate old and current values for the given field.
              existing[field] = `${existing[field]}${separator}${
                record[field]
              }`;
            });

            recordsAgg.push(existing);
          }
        });

        recordsAgg.forEach(record => {
          const data = transformRecord(record);
          dataString += `${JSON.stringify(data)}\n`;
        });

        // Load data
        const params = {
          Bucket: BUCKET,
          Key: `${key}.ndjson`,
          Body: dataString,
          ContentType: 'application/x-ndjson',
        };

        await s3.upload(params).promise();

        await messenger.send({
          message: {
            computed_key: key,
            status_message:
              'XLS parsed successfully. Results will be uploaded to ElasticSearch soon...',
            status_code: STATUS.PARSED,
          },
          to: ['logs'],
        });

        return resolve('XLS parsed successfully');
      });
    });
  } catch (e) {
    throw e;
  }
};

export default handler;
