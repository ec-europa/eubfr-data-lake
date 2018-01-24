import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import connectionClass from 'http-aws-es';
import elasticsearch from 'elasticsearch';
import path from 'path';

import Logger from '@eubfr/logger-listener/src/lib/Logger';

// Import constants
import { STATUS } from '../../../../storage/meta-index/src/lib/status';
import prepareMessage from '../lib/prepareMessage';

export const handler = async (event, context, callback) => {
  // Extract env vars
  const { API, INDEX, REGION, STAGE } = process.env;

  if (!API || !INDEX || !REGION || !STAGE) {
    return callback(
      Error(`API, INDEX, REGION and STAGE environment variables are required!`)
    );
  }

  /*
   * Some checks here before going any further
   */

  if (!event.Records) {
    return callback('No record');
  }

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
  const computedObjectKey = s3record.s3.object.key;
  const producerId = computedObjectKey.split('/')[0];
  const producer = path.dirname(computedObjectKey);
  const extension = path.extname(computedObjectKey).slice(1);

  // Get Account ID from lambda function arn in the context
  const accountId = context.invokedFunctionArn.split(':')[4];

  // Get SNS topics' endpoints for subscribers this service need to inform on new a new file being added to the data lake.
  const producerEtlSnsEndpointArn = `arn:aws:sns:${REGION}:${accountId}:${STAGE}-etl-${producer}-${extension}`;
  const metaIndexSnsEndpointArn = `arn:aws:sns:${REGION}:${accountId}:${STAGE}-MetaStatusReported`;
  const loggerIndexSnsEndpointArn = `arn:aws:sns:${REGION}:${accountId}:${STAGE}-onLogEmitted`;

  // AWS clients
  const s3 = new AWS.S3();
  const sns = new AWS.SNS();

  // Instantiate logs SNS topic communicator.
  const logger = new Logger({
    sns,
    targetArn: loggerIndexSnsEndpointArn,
    emitter: context.invokedFunctionArn,
  });

  // Instantiate meta index communicator.
  const client = elasticsearch.Client({
    host: `https://${API}`,
    apiVersion: '6.0',
    connectionClass,
    index: INDEX,
  });

  // When a file gets uploaded to an S3 bucket for ingestion.
  try {
    const message = 'File uploaded. Forwarding to the right ETL...';

    // Log success for a file being uploaded.
    await logger.info({
      message: {
        computed_key: computedObjectKey,
        status_message: message,
      },
    });

    // Insert meta data about the uploaded file to the meta index.
    try {
      const data = await s3
        .headObject({
          Bucket: s3record.s3.bucket.name,
          Key: computedObjectKey,
        })
        .promise();

      const meta = data.Metadata || {};

      const {
        'original-key': originalKey = null,
        producer: producerArn = null,
        ...otherMeta
      } = meta;

      const item = {
        producer_id: producerId,
        computed_key: computedObjectKey,
        original_key: originalKey,
        producer_arn: producerArn,
        content_type: data.ContentType,
        last_modified: data.LastModified.toISOString(), // ISO-8601 date
        content_length: Number(data.ContentLength),
        metadata: otherMeta,
        status: STATUS.UPLOADED,
      };

      await client.index({
        index: INDEX,
        type: 'file',
        body: item,
      });

      // Send success SNS message for file being uploaded.
      await sns
        .publish(
          prepareMessage(
            {
              key: computedObjectKey,
              status: STATUS.UPLOADED,
              message,
            },
            metaIndexSnsEndpointArn
          )
        )
        .promise();
    } catch (err) {
      return callback(err.message);
    }

    try {
      // Prepare to notify an ETL topic for a given file extension.
      const snsMessage = {
        default: JSON.stringify({
          eventTime: s3record.eventTime,
          userIdentity: s3record.userIdentity,
          bucket: s3record.s3.bucket,
          object: s3record.s3.object,
        }),
      };

      // Log success pinging an ETL
      await logger.info({
        message: {
          computed_key: computedObjectKey,
          status_message: `ETL "${producer}-${extension}" has been pinged!`,
        },
      });

      // Send an sns message success pinging an ETL
      await sns
        .publish({
          Message: JSON.stringify(snsMessage),
          MessageStructure: 'json',
          TargetArn: producerEtlSnsEndpointArn,
        })
        .promise();
    } catch (err) {
      const errorMessage = `Unable to ping ETL "${producer}-${extension}".`;

      // Log error pinging the right ETL topic.
      await logger.error({
        message: {
          computed_key: computedObjectKey,
          status_message: errorMessage,
        },
      });

      // Send error SNS message for a wrong file extension.
      await sns
        .publish(
          prepareMessage(
            {
              key: computedObjectKey,
              status: STATUS.ERROR,
              message: errorMessage,
            },
            metaIndexSnsEndpointArn
          )
        )
        .promise();
    }
  } catch (err) {
    return callback(err.message);
  }
};

export default handler;
