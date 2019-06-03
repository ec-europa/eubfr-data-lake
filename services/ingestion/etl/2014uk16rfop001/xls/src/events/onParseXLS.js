import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import XLSX from 'xlsx';

// ETL utilities.
import ensureExtensions from '@eubfr/lib/etl/ensureExtensions';
import extractMessage from '@eubfr/lib/etl/extractMessage';
import handleError from '@eubfr/lib/etl/handleError';

import MessengerFactory from '@eubfr/logger-messenger/src/lib/MessengerFactory';
import { STATUS } from '@eubfr/logger-messenger/src/lib/status';

import getFundingType from '../lib/getFundingType';
import getRecords from '../lib/getRecords';
import getTransform from '../lib/transform/getTransform';

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
        const workbook = XLSX.read(buffer, {
          cellText: false,
          cellDates: true,
        });
        const sheetNameList = workbook.SheetNames;
        // Take into account only first sheet.
        const sheet = workbook.Sheets[sheetNameList[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);

        // The incoming XLS file could contain different types of information depending on funding type.
        const type = getFundingType(rows);

        if (!type) {
          const error =
            'Provided file does not contain a valid structure for giving information about ESF or ESIF types of funding!';

          await handleError(
            { messenger, key, statusCode: STATUS.ERROR },
            {
              error,
              callback: reject,
            }
          );

          throw error;
        }

        // Try to get the right transform corresponding function for this funding type.
        const transform = getTransform(type);

        if (!transform) {
          const error = `Couldn't find a transform function corresponding to ${type}`;

          await handleError(
            { messenger, key, statusCode: STATUS.ERROR },
            {
              error,
              callback: reject,
            }
          );

          throw error;
        }

        // At this point, we have ensured that we can handle the incoming XLS file.
        // So it's worth preparing the data for the transform function.
        const records = getRecords({ rows, type });

        records.forEach(record => {
          const data = transform(record);
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
