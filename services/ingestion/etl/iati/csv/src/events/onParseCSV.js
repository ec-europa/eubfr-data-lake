import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import parse from 'csv-parse';
import transform from 'stream-transform';

import MessengerFactory from '@eubfr/logger-messenger/src/lib/MessengerFactory';
import { STATUS } from '@eubfr/logger-messenger/src/lib/status';

// Import logic
import extractMessage from '../lib/sns';
import transformRecord from '../lib/transform';

export const handler = async (event, context, callback) => {
  // Extract env vars
  const { BUCKET, REGION, STAGE } = process.env;

  if (!BUCKET || !REGION || !STAGE) {
    return callback(
      new Error('BUCKET, REGION and STAGE environment variables are required!')
    );
  }

  // Validate handler execution and check event, context, etc.
  const snsMessage = extractMessage(event);
  const { key } = snsMessage.object;

  const messenger = MessengerFactory.Create({ context });

  const handleError = async (e, cb) => {
    await messenger.send({
      message: {
        computed_key: key,
        status_message: e.message,
        status_code: STATUS.ERROR,
      },
      to: ['logs'],
    });

    return cb(e);
  };

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
      computed_key: key,
      status_message: 'Start parsing CSV...',
      status_code: STATUS.PARSING,
    },
    to: ['logs'],
  });

  const readStream = s3
    .getObject({ Bucket: snsMessage.bucket.name, Key: key })
    .createReadStream();

  let activities = '';

  return new Promise((resolve, reject) => {
    readStream
      .pipe(parser)
      .on('error', async e =>
        handleError(new Error(`Error on parse: ${e.message}`, reject))
      )
      .pipe(transformer)
      .on('error', async e =>
        handleError(new Error(`Error on transform: ${e.message}`, reject))
      )
      .on('data', data => {
        activities += data;
      })
      .on('error', async e =>
        handleError(new Error(`Error on upload: ${e.message}`, reject))
      )
      .on('end', async () => {
        // Load data
        const params = {
          Bucket: BUCKET,
          Key: `${key}.ndjson`,
          Body: activities,
          ContentType: 'application/x-ndjson',
        };

        return s3.upload(params, async err => {
          if (err) {
            return handleError(err, reject);
          }

          await messenger.send({
            message: {
              computed_key: key,
              status_message:
                'CSV parsed successfully. Results will be uploaded to ElasticSearch soon...',
              status_code: STATUS.PARSED,
            },
            to: ['logs'],
          });

          return resolve(null, 'CSV parsed successfully');
        });
      });
  });
};

export default handler;
