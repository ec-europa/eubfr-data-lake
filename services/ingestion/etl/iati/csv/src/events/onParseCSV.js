import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

// ETL utilities.
import ensureExtensions from '@eubfr/lib/etl/ensureExtensions';
import extractMessage from '@eubfr/lib/etl/extractMessage';
import handleError from '@eubfr/lib/etl/handleError';

import MessengerFactory from '@eubfr/logger-messenger/src/lib/MessengerFactory';
import { STATUS } from '@eubfr/logger-messenger/src/lib/status';

// Pipeline.
import parser from '../lib/parser';
import transformer from '../lib/transformer';

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

    if (!ensureExtensions({ file: key, extensions: ['.csv'] })) {
      throw new Error('CSV file expected for this ETL.');
    }

    const messenger = MessengerFactory.Create({ context });
    const s3 = new AWS.S3();

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

    let projects = '';

    return new Promise((resolve, reject) => {
      readStream
        .pipe(parser)
        .on('error', async e =>
          handleError(
            { messenger, key, statusCode: STATUS.ERROR },
            { error: e, callback: reject }
          )
        )
        .pipe(transformer)
        .on('error', async e =>
          handleError(
            { messenger, key, statusCode: STATUS.ERROR },
            { error: e, callback: reject }
          )
        )
        .on('data', data => {
          projects += data;
        })
        .on('end', async () => {
          const params = {
            Bucket: BUCKET,
            Key: `${key}.ndjson`,
            Body: projects,
            ContentType: 'application/x-ndjson',
          };

          await s3.upload(params).promise();

          await messenger.send({
            message: {
              computed_key: key,
              status_message:
                'CSV parsed successfully. Results will be uploaded to ElasticSearch soon...',
              status_code: STATUS.PARSED,
            },
            to: ['logs'],
          });

          return resolve('CSV parsed successfully');
        });
    });
  } catch (e) {
    throw e;
  }
};

export default handler;
