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

  const handleError = e =>
    messenger.send({
      message: {
        computed_key: message.object.key,
        status_message: e,
        status_code: STATUS.ERROR,
      },
      to: ['logs', 'meta'],
    });

  await messenger.send({
    message: {
      computed_key: message.object.key,
      status_message: 'Start parsing JSON...',
      status_code: STATUS.PARSING,
    },
    to: ['logs', 'meta'],
  });

  // Get file
  const file = s3
    .getObject({
      Bucket: message.bucket.name,
      Key: message.object.key,
    })
    .createReadStream();

  // Put data in buffer
  const buffers = [];
  file.on('data', data => {
    buffers.push(data);
  });

  file.on('error', handleError);

  // Manage data
  return file.on('end', () => {
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
      return handleError(e.message);
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
        return handleError(err);
      }

      return messenger.send({
        message: {
          computed_key: message.object.key,
          status_message:
            'JSON parsed successfully. Results will be uploaded to ElasticSearch soon...',
          status_code: STATUS.PARSED,
        },
        to: ['logs', 'meta'],
      });
    });
  });
};

export default handler;
