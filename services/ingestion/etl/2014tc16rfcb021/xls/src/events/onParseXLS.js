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
        const combinedFromSheets = [];

        // Parse file
        const buffer = Buffer.concat(buffers);
        const workbook = XLSX.read(buffer, {
          cellText: false,
          cellDates: true,
        });
        const sheets = workbook.SheetNames;

        sheets.forEach(sheet => {
          const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
          // This contains info about what is later EMPTY, EMPTY_1, etc.
          const emptyFieldMap = rows.shift();

          rows.forEach(row => {
            // The presence of this field is a marker of useful data.
            if (row['e-MS code']) {
              const rowImproved = {};

              Object.keys(row).forEach(field => {
                let fieldImproved = field;

                if (field.includes('__EMPTY') && field in emptyFieldMap) {
                  fieldImproved = emptyFieldMap[field];
                }

                fieldImproved = fieldImproved
                  .trim()
                  .replace(/(\r\n|\n|\r)/gm, '')
                  .replace(/\s+/g, ' ');

                rowImproved[fieldImproved] = row[field];
              });

              combinedFromSheets.push(rowImproved);
            }
          });
        });

        // Clearning records, which are "glue" rows.
        const records = combinedFromSheets
          .filter(record => record.Ranking !== 'Nr. crt ')
          .filter(record => record.Ranking !== 'Нр.');

        records.forEach(record => {
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
