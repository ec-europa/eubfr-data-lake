import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import path from 'path';
import elasticsearch from 'elasticsearch';
import connectionClass from 'http-aws-es';

import MessengerFactory from '@eubfr/logger-messenger/src/lib/MessengerFactory';
import { STATUS } from '@eubfr/logger-messenger/src/lib/status';

export const handler = async (event, context, callback) => {
  // Extract env vars
  const { META_ENDPOINT, META_INDEX, REGION, STAGE } = process.env;

  if (!META_ENDPOINT || !META_INDEX || !REGION || !STAGE) {
    return callback(
      new Error(
        'META_ENDPOINT, META_INDEX, REGION and STAGE environment variables are required!'
      )
    );
  }

  /*
   * Some checks here before going any further
   */

  if (!event.Records) {
    return callback(new Error('No record'));
  }

  // Only work on the first record
  const snsRecord = event.Records ? event.Records[0] : undefined;

  // Was the lambda triggered correctly? Is the file extension supported? etc.
  if (!snsRecord || snsRecord.EventSource !== 'aws:sns') {
    return callback(new Error('Bad record'));
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
  // const accountId = `491621799026`;
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
      computed_key: computedObjectKey,
      content_length: Number(data.ContentLength),
      content_type: data.ContentType,
      last_modified: data.LastModified.toISOString(), // ISO-8601 date
      message: 'File uploaded. Forwarding to the right ETL...',
      metadata: otherMeta,
      original_key: originalKey,
      producer_arn: producerArn,
      producer_id: producerId,
      status: STATUS.UPLOADED,
    };

    // elasticsearch client instantiation
    const client = elasticsearch.Client({
      host: `https://${META_ENDPOINT}`,
      apiVersion: '6.0',
      connectionClass,
      index: META_INDEX,
    });

    await client.index({
      index: META_INDEX,
      type: 'file',
      body: item,
    });

    await messenger.send({
      message: {
        computed_key: computedObjectKey,
        status_message: 'File uploaded. Forwarding to the right ETL...',
        status_code: STATUS.UPLOADED,
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
      to: ['logs'],
    });

    return callback(err);
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
        status_code: STATUS.PROGRESS,
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

    return callback(err);
  }
};

export default handler;
