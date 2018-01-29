import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import parse from 'csv-parse';
import transform from 'stream-transform';

import MessengerFactory from '@eubfr/logger-messenger/src/lib/MessengerFactory';
import { STATUS } from '@eubfr/logger-messenger/src/lib/status';

// Import logic
import { extractMessage } from '../lib/sns';
import transformRecord from '../lib/transform';
import uploadFromStream from '../lib/uploadFromStream';

export const handler = async (event, context, callback) => {
  // Extract env vars
  const { BUCKET, REGION, STAGE } = process.env;

  if (!BUCKET || !REGION || !STAGE) {
    return callback(
      Error('BUCKET, REGION and STAGE environment variables are required!')
    );
  }

  // Validate handler execution and check event, context, etc.
  const snsMessage = extractMessage(event);

  const messenger = MessengerFactory.Create({ context });

  const onError = e =>
    messenger.send({
      message: {
        computed_key: snsMessage.object.key,
        status_message: e,
        status_code: STATUS.ERROR,
      },
      to: ['logs', 'meta'],
    });

  const s3 = new AWS.S3();

  /*
   * Configure the pipeline
   */

  // Parse
  const parser = parse({ columns: true });

  // Transform
  const transformer = transform(
    (record, cb) => {
      try {
        const data = transformRecord(record);
        return cb(null, `${JSON.stringify(data)}\n`);
      } catch (e) {
        return cb(e);
      }
    },
    { parallel: 10 }
  );

  /*
   * Start the hard work
   */
  await messenger.send({
    message: {
      computed_key: snsMessage.object.key,
      status_message: 'Start parsing CSV...',
      status_code: STATUS.PARSING,
    },
    to: ['logs', 'meta'],
  });

  return s3
    .getObject({
      Bucket: snsMessage.bucket.name,
      Key: snsMessage.object.key,
    })
    .createReadStream()
    .pipe(parser)
    .on('error', e => onError(`Error on parse: ${e.message}`))
    .pipe(transformer)
    .on('error', e => onError(`Error on transform: ${e.message}`))
    .pipe(
      await uploadFromStream({
        key: snsMessage.object.key,
        BUCKET,
        s3,
        onError,
        context,
      })
    )
    .on('error', e => onError(`Error on upload: ${e.message}`))
    .on('end', async () => {
      await messenger.send({
        message: {
          computed_key: snsMessage.object.key,
          status_message:
            'CSV parsed successfully. Results will be uploaded to ElasticSearch soon...',
          status_code: STATUS.PARSED,
        },
        to: ['logs', 'meta'],
      });
    });
};

export default handler;
