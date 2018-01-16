import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import elasticsearch from 'elasticsearch';
import connectionClass from 'http-aws-es';

import { STATUS } from './onStatusReported';

export const handler = async (event, context, callback) => {
  const { API, INDEX } = process.env;

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

  // Retrieve file meta
  const s3 = new AWS.S3();

  const computedKey = s3record.s3.object.key;
  const producerId = computedKey.split('/')[0];

  try {
    const data = await s3.headObject({
      Bucket: s3record.s3.bucket.name,
      Key: computedKey,
    });

    const meta = data.Metadata || {};

    const {
      'original-key': originalKey = null,
      producer: producerArn = null,
      ...otherMeta
    } = meta;

    const item = {
      producer_id: producerId,
      computed_key: computedKey,
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
