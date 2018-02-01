import path from 'path';
import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import xml2js from 'xml2js';

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

  const s3 = new AWS.S3();
  const messenger = MessengerFactory.Create({ context });

  // Only work on the first record
  const snsRecord = event.Records ? event.Records[0] : undefined;

  // Was the lambda triggered correctly? Is the file extension supported? etc.
  if (!snsRecord || snsRecord.EventSource !== 'aws:sns') {
    callback(new Error('Bad record'));
  }

  /*
   * Prepare file analysis
   */

  // Extract message
  const message = JSON.parse(snsRecord.Sns.Message);

  // Check file extension
  if (path.extname(message.object.key) !== '.xml') {
    return callback(new Error('File extension should be .xml'));
  }

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
      status_message: 'Start parsing XML...',
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
  file.on('end', () => {
    let dataString = '';

    try {
      // Parse file
      const buffer = Buffer.concat(buffers);

      const parser = xml2js.Parser();
      parser.parseString(buffer, (err, result) => {
        if (result.main && result.main.DATA_RECORD) {
          const res = result.main.DATA_RECORD;
          for (let i = 0; i < res.length; i += 1) {
            // Transform data
            const data = transformRecord(res[i]);
            dataString += `${JSON.stringify(data)}\n`;
          }
        }
      });
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
            'XML parsed successfully. Results will be uploaded to ElasticSearch soon...',
          status_code: STATUS.PARSED,
        },
        to: ['logs', 'meta'],
      });
    });
  });

  return file;
};

export default handler;
