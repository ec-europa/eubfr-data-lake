import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

import through2 from 'through2';
import split2 from 'split2';

import QueueStream from '../lib/QueueStream';

import Logger from '../../../../logger/listener/src/lib/Logger';

export const handler = async (event, context, callback) => {
  const { REGION, STAGE, QUEUE_NAME } = process.env;

  /*
   * Some checks here before going any further
   */
  if (!event.Records) {
    return callback('No record');
  }

  // Only work on the first record
  const snsRecord = event.Records[0];

  // Was the lambda triggered correctly? Is the file extension supported? etc.
  if (!snsRecord || snsRecord.EventSource !== 'aws:sns') {
    return callback('Bad record');
  }

  // Get Account ID from lambda function arn in the context
  const accountId = context.invokedFunctionArn.split(':')[4];
  const sns = new AWS.SNS();

  console.log(
    'arn',
    `arn:aws:sns:${REGION}:${accountId}:${STAGE}-onLogEmitted`
  );

  const logger = new Logger({
    sns,
    targetArn: `arn:aws:sns:${REGION}:${accountId}:${STAGE}-onLogEmitted`,
    emitter: context.invokedFunctionArn,
  });

  /*
   * Extract information from the event
   */

  // Extract S3 record
  const s3Record = JSON.parse(snsRecord.Sns.Message);

  // Get original computed key (without '.ndjson')
  const originalComputedKey = s3Record.object.key.replace('.ndjson', '');

  try {
    await logger.info({
      message: {
        computed_key: originalComputedKey,
        status_message: 'Preparing enrichment',
      },
    });

    // s3 client instantiation
    const s3 = new AWS.S3();

    // Make sure the file exists
    await s3
      .headObject({
        Bucket: s3Record.bucket.name,
        Key: s3Record.object.key,
      })
      .promise();

    const queueUrl = `https://sqs.${REGION}.amazonaws.com/${accountId}/${QUEUE_NAME}`;

    // Prepare push to SQS
    const queueStream = new QueueStream({
      objectMode: true,
      sqs: new AWS.SQS({ apiVersion: '2012-11-05' }),
      queueUrl,
    });

    const onPipeError = async e =>
      logger.error({
        message: {
          computed_key: originalComputedKey,
          status_message: e.message,
        },
      });

    return s3
      .getObject({
        Bucket: s3Record.bucket.name,
        Key: s3Record.object.key,
      })
      .createReadStream()
      .pipe(split2(JSON.parse))
      .on('error', onPipeError)
      .pipe(
        through2.obj((chunk, enc, cb) => {
          // Enhance item to save
          const item = Object.assign(
            {
              computed_key: s3Record.object.key,
            },
            chunk
          );

          return cb(null, item);
        })
      )
      .on('error', onPipeError)
      .pipe(queueStream)
      .on('error', onPipeError)
      .on('finish', async () => {
        await logger.info({
          message: {
            computed_key: originalComputedKey,
            status_message: 'All projects have been sent to enrichment',
          },
        });

        return callback(null, 'All projects have been sent to enrichment');
      });
  } catch (err) {
    await logger.error({
      message: {
        computed_key: originalComputedKey,
        status_message: err.message,
      },
    });

    return callback(err.message);
  }
};

export default handler;
