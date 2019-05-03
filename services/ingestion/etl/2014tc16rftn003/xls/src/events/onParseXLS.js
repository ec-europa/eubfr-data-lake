import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import XLSX from 'xlsx';

// ETL utilities.
import ensureExtensions from '@eubfr/lib/etl/ensureExtensions';
import extractMessage from '@eubfr/lib/etl/extractMessage';
import handleError from '@eubfr/lib/etl/handleError';

import MessengerFactory from '@eubfr/logger-messenger/src/lib/MessengerFactory';
import { STATUS } from '@eubfr/logger-messenger/src/lib/status';

import getRecords from '../lib/getRecords';
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
        const records = [];
        let dataString = '';

        // Parse file
        const buffer = Buffer.concat(buffers);
        const workbook = XLSX.read(buffer);

        // Two sheets contain useful information from this file.
        const ops = XLSX.utils.sheet_to_json(workbook.Sheets['Operations']);
        const bens = XLSX.utils.sheet_to_json(workbook.Sheets['Beneficiaries']);

        // Extract useful data and convert EMPTY props to their human-readable values.
        const operations = getRecords(ops);
        const beneficiaries = getRecords(bens);

        operations.forEach(operation => {
          // Marker.
          const operationName = operation['Operation name'];
          // Accumulator of reletated information.
          const operationBeneficiaries = [];
          // A copy to modify.
          const operationCombined = JSON.parse(JSON.stringify(operation));
          // Remove the following fields which are going to be taken from the separate, more informative sheet about beneficieries.
          delete operationCombined['Beneficiary name'];
          delete operationCombined['Beneficiary name in English'];
          delete operationCombined['Has the lead of the operation (Y/N)'];
          delete operationCombined[
            'Total eligible expenditure allocated to the beneficiary'
          ];
          delete operationCombined[
            'Union co-financing rate in % (average as in CP)'
          ];

          // Find the "leading" index marking a series of items from the list of beneficiaries belonging to the project.
          const start = beneficiaries.findIndex(
            needle => needle['Operation name'] === operationName
          );

          // We want to take only those beneficiaries which belong to the selected project.
          for (let i = start; i < beneficiaries.length; i++) {
            if (
              beneficiaries[i]['Operation name'] !== operationName && // Keep the first start/needle leader.
              beneficiaries[i]['Operation name'] // When the loop hits a row with this property, it means the merge in Excel has finished and we have gathered all related beneficiries to the given operation.
            ) {
              break;
            }

            operationBeneficiaries.push(beneficiaries[i]);
          }

          operationBeneficiaries.forEach(beneficiary => {
            // Except the operation name, copy all data form beneficiaries back to the main operation/project.
            Object.keys(beneficiary).forEach(field => {
              if (operationCombined[field] && field !== 'Operation name') {
                operationCombined[field] += `;${beneficiary[field]}`;
              } else {
                operationCombined[field] = beneficiary[field];
              }
            });
          });

          records.push(operationCombined);
        });

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
