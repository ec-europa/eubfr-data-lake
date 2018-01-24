import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import path from 'path';

import Logger from '@eubfr/logger-listener/src/lib/Logger';

// Import constants
import { STATUS } from '../../../../storage/meta-index/src/lib/status';
import prepareMessage from '../lib/prepareMessage';

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

  // Extract env vars
  const { REGION, STAGE } = process.env;

  // Get the endpoint arn
  const objectKey = s3record.s3.object.key;
  const producer = path.dirname(objectKey);
  const extension = path.extname(objectKey).slice(1);

  const endpointArn = `arn:aws:sns:${REGION}:${accountId}:${STAGE}-etl-${producer}-${extension}`;
  const endpointMetaIndexArn = `arn:aws:sns:${REGION}:${accountId}:${STAGE}-MetaStatusReported`;

  /*
   * Send the SNS message
   */
  try {
    const sns = new AWS.SNS();

    const logger = new Logger({
      sns,
      targetArn: `arn:aws:sns:${REGION}:${accountId}:${STAGE}-onLogEmitted`,
      emitter: context.invokedFunctionArn,
    });

    const message = 'File uploaded. Forwarding to the right ETL...';

    await logger.info({
      message: {
        computed_key: objectKey,
        status_message: message,
      },
    });

    await sns
      .publish(
        prepareMessage(
          {
            key: objectKey,
            status: STATUS.UPLOADED,
            message,
          },
          endpointMetaIndexArn
        )
      )
      .promise();

    try {
      await sns
        .publish({
          Message: JSON.stringify(payload),
          MessageStructure: 'json',
          TargetArn: endpointArn,
        })
        .promise();

      await logger.info({
        message: {
          computed_key: objectKey,
          status_message: `ETL "${producer}-${extension}" has been pinged!`,
        },
      });
    } catch (err) {
      const errorMessage = `Unable to ping ETL "${producer}-${extension}".`;

      await logger.error({
        message: {
          computed_key: objectKey,
          status_message: errorMessage,
        },
      });

      await sns
        .publish(
          prepareMessage(
            {
              key: objectKey,
              status: STATUS.ERROR,
              message: errorMessage,
            },
            endpointMetaIndexArn
          )
        )
        .promise();
    }

    return callback(null, 'Success!');
  } catch (err) {
    return callback(err.message);
  }
};

export default handler;
