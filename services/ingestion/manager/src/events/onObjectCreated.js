import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import path from 'path';

import CreateMessengerFactory from '@eubfr/logger-listener/src/lib/CreateMessengerFactory';
import { STATUS } from '@eubfr/storage-meta-index/src/lib/status';

export const handler = async (event, context, callback) => {
  // Extract env vars
  const { REGION, STAGE } = process.env;

  if (!REGION || !STAGE) {
    callback(Error('REGION and STAGE environment variables are required!'));
  }

  /*
   * Some checks here before going any further
   */

  if (!event.Records) {
    callback(Error('No record'));
  }

  // Only work on the first record
  const snsRecord = event.Records ? event.Records[0] : undefined;

  // Was the lambda triggered correctly? Is the file extension supported? etc.
  if (!snsRecord || snsRecord.EventSource !== 'aws:sns') {
    callback(Error('Bad record'));
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

  const messenger = CreateMessengerFactory({ event, context });

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
    await messenger.info(
      {
        message: {
          computed_key: computedObjectKey,
          status_message: STATUS.UPLOADED,
          type: 'file',
          body: item,
        },
      },
      ['logs', 'meta']
    );
  } catch (err) {
    // Log error uploading a file for ingestion.
    await messenger.error(
      {
        message: {
          computed_key: computedObjectKey,
          status_message: STATUS.ERROR,
        },
      },
      ['logs', 'meta']
    );

    callback(err.message);
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
    await messenger.info(
      {
        message: {
          computed_key: computedObjectKey,
          status_message: `ETL "${producer}-${extension}" has been pinged!`,
        },
      },
      ['logs', 'meta']
    );

    // Send an sns message success pinging an ETL
    await sns
      .publish({
        Message: JSON.stringify(snsMessage),
        MessageStructure: 'json',
        TargetArn: producerEtlSnsEndpointArn,
      })
      .promise();
  } catch (err) {
    // Log error pinging the right ETL topic.
    await messenger.error(
      {
        message: {
          computed_key: computedObjectKey,
          status_message: `Unable to ping ETL "${producer}-${extension}".`,
        },
      },
      ['logs', 'meta']
    );
  }
};

export default handler;
