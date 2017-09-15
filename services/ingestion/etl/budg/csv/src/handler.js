/* eslint-disable import/prefer-default-export, no-console */
const AWS = require('aws-sdk');

export const parseCsv = (event, context, callback) => {
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

  // Extract message
  const message = JSON.parse(snsRecord.Sns.Message);

  // Get file
  // message.arn + message.object.key

  // Parse it
  // ...

  /*
   * Prepare the SNS message
   */

  // Fill the payload
  const payload = {
    default: JSON.stringify({
      time: message.eventTime,
      bucket: message.bucket,
      object: message.object,
    }),
  };

  // Get Account ID from lambda function arn in the context
  const accountId = context.invokedFunctionArn.split(':')[4];

  // Get stage and region from environment variables
  const stage = process.env.STAGE;
  const region = process.env.REGION;

  // Get the arn
  const endpointArn = `arn:aws:sns:${region}:${accountId}:${stage}-db`;

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
