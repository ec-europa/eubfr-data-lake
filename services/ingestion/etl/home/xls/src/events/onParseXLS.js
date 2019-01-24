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

        // Parse file
        const buffer = Buffer.concat(buffers);
        const workbook = XLSX.read(buffer);
        const sheetNameList = workbook.SheetNames;
        const parsedSheet = XLSX.utils.sheet_to_json(
          workbook.Sheets[sheetNameList[0]]
        );

        /**
         * Because the sheet's formatting is not structured,
         * we'll need to take some actions before using the data.
         */

        // The first element is "Report Title", placeholder not useful for us.
        parsedSheet.shift();

        // We get the header row, i.e. the titles.
        // They are in the form of
        // {
        //   "__EMPTY_1": "Project Call Id",
        //   "__EMPTY_2": "Project Number",
        //   ...
        // }
        const headerRow = parsedSheet[0];

        // Now leave only actual/useful records now.
        parsedSheet.shift();

        // Normalize the list by replacing properties
        const mappedRecords = parsedSheet.map(record => {
          const mapped = {};
          Object.keys(record).forEach(prop => {
            mapped[headerRow[prop]] = record[prop];
          });
          return mapped;
        });

        const combinedRecords = [];
        const matchField = 'Project Number';

        const accumulators = [
          'Participant Legal Name',
          'Participant Role',
          'Participant LE Country Code',
        ];

        mappedRecords.forEach(rawRecord => {
          const existingRecordIndex = combinedRecords.findIndex(
            combinedRecord =>
              combinedRecord[matchField] === rawRecord[matchField]
          );

          if (existingRecordIndex >= 0) {
            const recordTarget = combinedRecords[existingRecordIndex];

            accumulators.forEach(accumulatorField => {
              recordTarget[accumulatorField] = `${
                recordTarget[accumulatorField]
              };${rawRecord[accumulatorField]}`;
            });
          } else {
            combinedRecords.push(rawRecord);
          }
        });

        for (let i = 0; i < combinedRecords.length; i += 1) {
          // Transform data
          const data = transformRecord(combinedRecords[i]);
          dataString += `${JSON.stringify(data)}\n`;
        }

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
