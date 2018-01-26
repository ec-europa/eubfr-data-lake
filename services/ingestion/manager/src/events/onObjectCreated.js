import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import path from 'path';

import MessengerFactory from '@eubfr/logger-messenger/src/lib/MessengerFactory';
import { STATUS } from '@eubfr/storage-meta-index/src/lib/status';

export const handler = async (event, context, callback) => {
  // Extract env vars
  const { META_ENDPOINT, META_INDEX, REGION, STAGE } = process.env;

  if (!META_ENDPOINT || !META_INDEX || !REGION || !STAGE) {
    return callback(
      Error(
        'META_ENDPOINT, META_INDEX, REGION and STAGE environment variables are required!'
      )
    );
  }

  /*
   * Some checks here before going any further
   */

  if (!event.Records) {
    return callback(Error('No record'));
  }

  // Only work on the first record
  const snsRecord = event.Records ? event.Records[0] : undefined;

  // Was the lambda triggered correctly? Is the file extension supported? etc.
  if (!snsRecord || snsRecord.EventSource !== 'aws:sns') {
    return callback(Error('Bad record'));
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

  const accountId = context.invokedFunctionArn.split(':')[4];
  const producerEtlSnsEndpointArn = `arn:aws:sns:${REGION}:${accountId}:${STAGE}-etl-${producer}-${extension}`;

  // AWS clients
  const s3 = new AWS.S3();
  const sns = new AWS.SNS();

  const messenger = MessengerFactory.Create({ context });

  // Try to get meta data about raw file being uploaded.
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

    // Send success message for file being uploaded.
    // This must: 1) save record to meta es index
    // https://github.com/ec-europa/eubfr-data-lake/blob/d23c4f18958f721932802e64481d48ca672864fb/services/ingestion/manager/src/events/onObjectCreated.js#L116
    // 2) notify meta index sns topic https://github.com/ec-europa/eubfr-data-lake/blob/d23c4f18958f721932802e64481d48ca672864fb/services/ingestion/manager/src/events/onObjectCreated.js#L123
    await messenger.send({
      message: {
        computed_key: computedObjectKey,
        status_message: 'File uploaded. Forwarding to the right ETL...',
        status_code: STATUS.UPLOADED,
        persist: {
          type: 'file',
          body: item,
          in: ['meta'],
        },
      },
      to: ['logs'],
    });
  } catch (err) {
    // Log error uploading a file for ingestion.
    await messenger.send({
      message: {
        computed_key: computedObjectKey,
        status_message: `Failed file upload`,
        status_code: STATUS.ERROR,
      },
      to: ['logs', 'meta'],
    });

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
    await messenger.send({
      message: {
        computed_key: computedObjectKey,
        status_message: `ETL "${producer}-${extension}" has been pinged!`,
      },
      to: ['logs', 'meta'],
    });

    // Send an sns message success pinging an ETL
    return await sns
      .publish({
        Message: JSON.stringify(snsMessage),
        MessageStructure: 'json',
        TargetArn: producerEtlSnsEndpointArn,
      })
      .promise();
  } catch (err) {
    // Log error pinging the right ETL topic.
    await messenger.send({
      message: {
        computed_key: computedObjectKey,
        status_code: STATUS.ERROR,
        status_message: `Unable to ping ETL "${producer}-${extension}".`,
      },
      to: ['logs', 'meta'],
    });

    return callback(err.message);
  }
};

export default handler;
