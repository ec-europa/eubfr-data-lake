import path from 'path';
import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import XLSX from 'xlsx';

import MessengerFactory from '@eubfr/logger-messenger/src/lib/MessengerFactory';
import { STATUS } from '@eubfr/logger-messenger/src/lib/status';

import transformRecord from '../lib/transform';

export const handler = async (event, context, callback) => {
  // Get environment variables
  const { BUCKET, REGION, STAGE } = process.env;

  if (!BUCKET || !REGION || !STAGE) {
    return callback(
      new Error('BUCKET, REGION and STAGE environment variables are required!')
    );
  }

  const messenger = MessengerFactory.Create({ context });
  const s3 = new AWS.S3();

  /*
   * Some checks here before going any further
   */

  // Only work on the first record
  const snsRecord = event.Records ? event.Records[0] : undefined;

  // Was the lambda triggered correctly? Is the file extension supported? etc.
  if (!snsRecord || snsRecord.EventSource !== 'aws:sns') {
    return callback(new Error('Bad record'));
  }

  /*
   * Prepare file analysis
   */

  // Extract message
  const message = JSON.parse(snsRecord.Sns.Message);

  // Check file extension
  if (['.xls', '.xlsx'].indexOf(path.extname(message.object.key)) === -1) {
    return callback(new Error('File extension should be .xls or .xlsx'));
  }

  const handleError = async (e, cb) => {
    await messenger.send({
      message: {
        computed_key: message.object.key,
        status_message: e.message,
        status_code: STATUS.ERROR,
      },
      to: ['logs'],
    });

    return cb(e);
  };

  await messenger.send({
    message: {
      computed_key: message.object.key,
      status_message: 'Start parsing XLS...',
      status_code: STATUS.PARSING,
    },
    to: ['logs'],
  });

  // Get file
  const readStream = s3
    .getObject({
      Bucket: message.bucket.name,
      Key: message.object.key,
    })
    .createReadStream();

  return new Promise((resolve, reject) => {
    // Put data in buffer
    const buffers = [];
    readStream.on('data', data => {
      buffers.push(data);
    });

    readStream.on('error', e => handleError(e, reject));

    // Manage data
    readStream.on('end', () => {
      let dataString = '';

      try {
        // Parse file
        const buffer = Buffer.concat(buffers);
        const workbook = XLSX.read(buffer);
        const sheetNameList = workbook.SheetNames;
        const parser = XLSX.utils.sheet_to_json(
          workbook.Sheets[sheetNameList[0]]
        );

        for (let i = 0; i < parser.length; i += 1) {
          // Transform data
          const data = transformRecord(parser[i]);
          dataString += `${JSON.stringify(data)}\n`;
        }
      } catch (e) {
        return handleError(e, reject);
      }

      // Load data
      const params = {
        Bucket: BUCKET,
        Key: `${message.object.key}.ndjson`,
        Body: dataString,
        ContentType: 'application/x-ndjson',
      };

      return s3.upload(params, async err => {
        if (err) {
          return handleError(err, reject);
        }

        await messenger.send({
          message: {
            computed_key: message.object.key,
            status_message:
              'XLS parsed successfully. Results will be uploaded to ElasticSearch soon...',
            status_code: STATUS.PARSED,
          },
          to: ['logs'],
        });

        return resolve('XLS parsed successfully');
      });
    });
  });
};

export default handler;
