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
    callback(`API, INDEX, REGION and STAGE environment variable are required!`);
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
    callback('Bad record');
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

  // Fill the payload
  const payload = {
    default: JSON.stringify({
      eventTime: s3record.eventTime,
      userIdentity: s3record.userIdentity,
      bucket: s3record.s3.bucket,
      object: s3record.s3.object,
    }),
  };

  // Get Account ID from lambda function arn in the context
  const accountId = context.invokedFunctionArn.split(':')[4];

  // Get SNS topics' endpoints for subscribers this service need to inform on new a new file being added to the data lake.
  const producerEtlSnsEndpointArn = `arn:aws:sns:${REGION}:${accountId}:${STAGE}-etl-${producer}-${extension}`;
  const metaIndexSnsEndpointArn = `arn:aws:sns:${REGION}:${accountId}:${STAGE}-MetaStatusReported`;
  const loggerIndexSnsEndpointArn = `arn:aws:sns:${REGION}:${accountId}:${STAGE}-onLogEmitted`;

  // AWS clients
  const s3 = new AWS.S3();
  const sns = new AWS.SNS();

  /*
   * Send the SNS message
   */
  try {
    const logger = new Logger({
      sns,
      targetArn: loggerIndexSnsEndpointArn,
      emitter: context.invokedFunctionArn,
    });

    const message = 'File uploaded. Forwarding to the right ETL...';

    await logger.info({
      message: {
        computed_key: computedObjectKey,
        status_message: message,
      },
    });

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

    try {
      await sns
        .publish({
          Message: JSON.stringify(payload),
          MessageStructure: 'json',
          TargetArn: producerEtlSnsEndpointArn,
        })
        .promise();

      await logger.info({
        message: {
          computed_key: computedObjectKey,
          status_message: `ETL "${producer}-${extension}" has been pinged!`,
        },
      });
    } catch (err) {
      const errorMessage = `Unable to ping ETL "${producer}-${extension}".`;

      await logger.error({
        message: {
          computed_key: computedObjectKey,
          status_message: errorMessage,
        },
      });

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
      return callback(null, 'All fine');
    }
  } catch (err) {
    return callback(err.message);
  }

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

    // elasticsearch client instantiation
    const client = elasticsearch.Client({
      host: `https://${API}`,
      apiVersion: '6.0',
      connectionClass,
      index: INDEX,
    });

    await client.index({
      index: INDEX,
      type: 'file',
      body: item,
    });

    return callback(null, 'All fine');
  } catch (err) {
    return callback(err.message);
  }
};

export default handler;
