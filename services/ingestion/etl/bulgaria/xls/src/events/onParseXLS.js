import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import XLSX from 'xlsx';

// ETL utilities.
import ensureExtensions from '@eubfr/lib/etl/ensureExtensions';
import extractMessage from '@eubfr/lib/etl/extractMessage';
import handleError from '@eubfr/lib/etl/handleError';

import MessengerFactory from '@eubfr/logger-messenger/src/lib/MessengerFactory';
import { STATUS } from '@eubfr/logger-messenger/src/lib/status';

import transformRecord from '../lib/transform';

export const handler = async event => {
  const context = {
    callbackWaitsForEmptyEventLoop: true,
    logGroupName:
      '/aws/lambda/chernka249bg-ingestion-etl-bulgaria-xls-parseXls',
    logStreamName: '2019/04/11/[$LATEST]5eb941b6c31748979f9f6fed5f7a3c17',
    functionName: 'chernka249bg-ingestion-etl-bulgaria-xls-parseXls',
    memoryLimitInMB: '1024',
    functionVersion: '$LATEST',
    invokeid: '8eac3d15-24d2-409f-be66-1413a22f9591',
    awsRequestId: '8eac3d15-24d2-409f-be66-1413a22f9591',
    invokedFunctionArn:
      'arn:aws:lambda:eu-central-1:491621799026:function:chernka249bg-ingestion-etl-bulgaria-xls-parseXls',
  };

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

        // Parse file
        const buffer = Buffer.concat(buffers);
        const workbook = XLSX.read(buffer);
        const sheetNameList = workbook.SheetNames;
        const parsedData = XLSX.utils.sheet_to_json(
          workbook.Sheets[sheetNameList[0]]
        );

        // Remove first row which holds repeating "List of Operations in accordance with Regulation (EU) No 1303/2013"
        parsedData.shift();
        // Remove last row which holds "All amounts are in Bulgarian lev (BGN) / 1 EUR = 1,95583 BGN"
        parsedData.pop();
        // Remove last row which holds "Notes:"
        parsedData.pop();

        const columnsMap = parsedData.shift();

        // Work with the rest of the data.
        const improvedData = parsedData.map(row => {
          const improvedRow = {};

          // Re-map keys.
          // __EMPTY => Beneficiary Name
          // __EMPTY_1 => Operation Name
          Object.keys(row).forEach(columnKey => {
            const columnName = columnsMap[columnKey];
            improvedRow[columnName] = row[columnKey];
          });

          return improvedRow;
        });

        improvedData.forEach(record => {
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
