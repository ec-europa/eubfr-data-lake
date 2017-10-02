/* eslint-disable import/prefer-default-export, no-console */
const AWS = require('aws-sdk');

export const onCreate = (event, context, callback) => {
  /*
   * Some checks here before going any further
   */

  // Only work on the first record
  const snsRecord = event.Records[0];

  // Was the lambda triggered correctly? Is the file extension supported? etc.
  if (!snsRecord || snsRecord.EventSource !== 'aws:sns') {
    return callback('Bad record');
  }

  /*
   * Extract information from the event
   */

  // Extract S3 record
  const s3record = JSON.parse(snsRecord.Sns.Message).Records[0];

  // Fill the payload
  const payload = {
    default: JSON.stringify({
      eventTime: s3record.eventTime,
      userIdentity: s3record.userIdentity,
      bucket: s3record.s3.bucket,
      object: s3record.s3.object,
    }),
  };

  /*
   * Prepare the SNS message
   */

  // Get Account ID from lambda function arn in the context
  const accountId = context.invokedFunctionArn.split(':')[4];

  // Get stage and region from environment variables
  const stage = process.env.STAGE;
  const region = process.env.REGION;

  // Get the arn
  const endpointArn = `arn:aws:sns:${region}:${accountId}:${stage}-etl-budg-csv`;

  /*
   * Send the SNS message
   */

  const sns = new AWS.SNS();

  return sns.publish(
    {
      Message: JSON.stringify(payload),
      MessageStructure: 'json',
      TargetArn: endpointArn,
    },
    err => {
      if (err) {
        console.log(err.stack);
        callback(err);
        return;
      }

      callback(null, 'push sent');
    }
  );
};
