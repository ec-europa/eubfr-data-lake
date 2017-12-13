import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import parse from 'csv-parse';
import transform from 'stream-transform';

// Import constants
import { STATUS } from '../../../../../../storage/meta-index/src/events/onStatusReported';

// Import logic
import { extractMessage, prepareMessage } from '../lib/sns';
import transformRecord from '../lib/transform';
import uploadFromStream from '../lib/uploadFromStream';

export const handler = (event, context, callback) => {
  // 1. Validate handler execution
  // check event, context
  const snsMessage = extractMessage(event);

  // Extract env vars
  const { BUCKET, REGION, STAGE } = process.env;

  // Get Account ID from lambda function arn in the context
  const accountId = context.invokedFunctionArn.split(':')[4];

  // Get the endpoint arn
  const endpointArn = `arn:aws:sns:${REGION}:${accountId}:${STAGE}-MetaStatusReported`;

  const sns = new AWS.SNS();

  const onError = e =>
    sns.publish(
      prepareMessage(
        {
          key: snsMessage.object.key,
          status: STATUS.ERROR,
          message: JSON.stringify(e),
        },
        endpointArn
      ),
      snsErr => {
        if (snsErr) {
          return callback(snsErr);
        }

        return callback(e);
      }
    );

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
      uploadFromStream({
        key: snsMessage.object.key,
        BUCKET,
        s3,
        sns,
        endpointArn,
        onError,
        callback,
      })
    )
    .on('error', e => onError(`Error on upload: ${e.message}`));
};

export default handler;
