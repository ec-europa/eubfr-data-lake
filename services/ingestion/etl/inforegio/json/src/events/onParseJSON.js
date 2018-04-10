import path from 'path';
import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

import MessengerFactory from '@eubfr/logger-messenger/src/lib/MessengerFactory';
import { STATUS } from '@eubfr/logger-messenger/src/lib/status';

import transformRecord from '../lib/transform';

export const handler = async (event, context, callback) => {
  // Extract env vars
  const { BUCKET, REGION, STAGE } = process.env;

  if (!BUCKET || !REGION || !STAGE) {
    return callback(
      new Error('BUCKET, REGION and STAGE environment variables are required!')
    );
  }

  /*
   * Some checks here before going any further
   */

  // Only work on the first record
  const snsRecord = event.Records ? event.Records[0] : undefined;

  // Was the lambda triggered correctly? Is the file extension supported? etc.
  if (
    !snsRecord ||
    snsRecord.EventSource !== 'aws:sns' ||
    !snsRecord.Sns ||
    !snsRecord.Sns.Message
  ) {
    return callback(new Error('Bad record'));
  }

  /*
   * Prepare file analysis
   */

  // Extract message
  let message = {};
  try {
    message = JSON.parse(snsRecord.Sns.Message);
  } catch (e) {
    return callback(e);
  }

  if (!message.object || !message.object.key) {
    return callback(new Error('The message is not valid'));
  }

  // Check file extension
  if (path.extname(message.object.key) !== '.json') {
    return callback(new Error('File extension should be .json'));
  }

  const messenger = MessengerFactory.Create({ context });
  const s3 = new AWS.S3();

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
      status_message: 'Start parsing JSON...',
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
        let parser = JSON.parse(buffer);

        // Sometimes records are nested in items key.
        parser = parser.items ? parser.items : parser;

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
              'JSON parsed successfully. Results will be uploaded to ElasticSearch soon...',
            status_code: STATUS.PARSED,
          },
          to: ['logs'],
        });

        return resolve('JSON parsed successfully');
      });
    });
  });
};

export default handler;
