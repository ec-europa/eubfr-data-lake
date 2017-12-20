import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import path from 'path';

import Logger from '../../../../logger/listener/src/lib/Logger';

export const handler = async (event, context, callback) => {
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

  // Get the endpoint arn
  const objectKey = s3record.s3.object.key;
  const producer = path.dirname(objectKey);
  const extension = path.extname(objectKey).slice(1);

  const endpointArn = `arn:aws:sns:${region}:${accountId}:${stage}-etl-${producer}-${extension}`;

  /*
   * Send the SNS message
   */
  try {
    const sns = new AWS.SNS();

    const logger = new Logger({
      sns,
      targetArn: `arn:aws:sns:${region}:${accountId}:${stage}-onLogEmitted`,
      emitter: context.invokedFunctionArn,
    });

    await logger.info({
      type: 'file',
      message: {
        computed_key: s3record.s3.object.key,
        status_message:
          'The file has been uploaded. Forwarding to the right ETL...',
      },
    });

    await sns
      .publish({
        Message: JSON.stringify(payload),
        MessageStructure: 'json',
        TargetArn: endpointArn,
      })
      .promise();

    await logger.info({
      type: 'file',
      message: {
        computed_key: s3record.s3.object.key,
        status_message: `ETL "${producer}-${extension}" has been pinged`,
      },
    });

    return callback(null, 'Success!');
  } catch (err) {
    return callback(err.message);
  }
};

export default handler;
