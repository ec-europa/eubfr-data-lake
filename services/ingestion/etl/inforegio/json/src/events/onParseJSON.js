import path from 'path';
import stream from 'stream';
import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import transform from 'stream-transform';

import transformRecord from '../lib/transform';

// Destination bucket
const { BUCKET } = process.env;

export const handler = (event, context, callback) => {
  /*
   * Some checks here before going any further
   */

  // Only work on the first record
  const snsRecord = event.Records ? event.Records[0] : undefined;

  // Was the lambda triggered correctly? Is the file extension supported? etc.
  if (!snsRecord || snsRecord.EventSource !== 'aws:sns') {
    return callback('Bad record');
  }

  /*
   * Prepare file analysis
   */

  // Extract message
  const message = JSON.parse(snsRecord.Sns.Message);

  // Check file extension
  if (path.extname(message.object.key) !== '.json') {
    return callback('File extension should be .json');
  }

  /*
   * Prepare the SNS message
   */

  // Get Account ID from lambda function arn in the context
  const accountId = context.invokedFunctionArn.split(':')[4];

  // Get stage and region from environment variables
  const stage = process.env.STAGE;
  const region = process.env.REGION;

  // Get the endpoint arn
  const endpointArn = `arn:aws:sns:${region}:${accountId}:${stage}-etl-`;
  const sns = new AWS.SNS();

  const onError = e =>
    sns.publish(
      {
        Message: JSON.stringify({
          default: JSON.stringify({
            object: message.object.key,
            message: JSON.stringify(e),
          }),
        }),
        MessageStructure: 'json',
        TargetArn: `${endpointArn}failure`,
      },
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

  // Transform
  const transformer = transform(
    (record, cb) => {
      try {
        const data = transformRecord(JSON.parse(record));
        return cb(null, `${JSON.stringify(data)}\n`);
      } catch (e) {
        return cb(e);
      }
    },
    { parallel: 10 }
  );

  // Load
  const uploadFromStream = () => {
    const pass = new stream.PassThrough();

    const params = {
      Bucket: BUCKET,
      Key: `${message.object.key}.ndjson`,
      Body: pass,
      ContentType: 'application/x-ndjson',
    };

    s3.upload(params, err => {
      if (err) {
        return onError(err);
      }

      // Publish message to ETL Success topic

      /*
       * Send the SNS message
       */
      return sns.publish(
        {
          Message: JSON.stringify({
            default: JSON.stringify({
              object: message.object.key,
              message: JSON.stringify('ETL successful'),
            }),
          }),
          MessageStructure: 'json',
          TargetArn: `${endpointArn}success`,
        },
        snsErr => {
          if (snsErr) {
            callback(snsErr);
            return;
          }

          callback(null, 'push sent');
        }
      );
    });

    return pass;
  };

  /*
   * Start the hard work
   */

  return s3
    .getObject({
      Bucket: message.bucket.name,
      Key: message.object.key,
    })
    .createReadStream()
    .pipe(transformer)
    .on('error', e => onError(`Error on transform: ${e.message}`))
    .pipe(uploadFromStream())
    .on('error', e => onError(`Error on upload: ${e.message}`));
};

export default handler;
