import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

import through2Batch from 'through2-batch';
import split2 from 'split2';
import crypto from 'crypto';

import MessengerFactory from '@eubfr/logger-messenger/src/lib/MessengerFactory';
import { STATUS } from '@eubfr/logger-messenger/src/lib/status';

import SaveStream from '../lib/SaveStream';

export const handler = async (event, context, callback) => {
  const { API, INDEX, REGION, STAGE, DELIVERY_STREAM_NAME } = process.env;

  if (!API || !INDEX || !REGION || !STAGE || !DELIVERY_STREAM_NAME) {
    return callback(new Error('Missing required environment variables!'));
  }

  /*
   * Some checks here before going any further
   */
  if (!event.Records) {
    return callback(new Error('No record'));
  }

  // Only work on the first record
  const snsRecord = event.Records[0];

  // Was the lambda triggered correctly? Is the file extension supported? etc.
  if (!snsRecord || snsRecord.EventSource !== 'aws:sns') {
    return callback(new Error('Bad record'));
  }

  // Get Account ID from lambda function arn in the context
  const accountId = context.invokedFunctionArn.split(':')[4];
  const sns = new AWS.SNS();

  const firehose = new AWS.Firehose();
  const messenger = MessengerFactory.Create({ context });
  const s3 = new AWS.S3();

  /*
   * Extract information from the event
   */

  // Extract S3 record
  const s3record = JSON.parse(snsRecord.Sns.Message).Records[0];

  // Get original computed key (without '.ndjson')
  const originalComputedKey = s3record.s3.object.key.replace('.ndjson', '');

  try {
    await messenger.send({
      message: {
        computed_key: originalComputedKey,
        status_message: 'Preparing the upload to ElasticSearch...',
        status_code: STATUS.PROGRESS,
      },
      to: ['logs'],
    });

    const data = await s3
      .headObject({
        Bucket: s3record.s3.bucket.name,
        Key: s3record.s3.object.key,
      })
      .promise();

    await messenger.send({
      message: {
        computed_key: originalComputedKey,
        status_message: 'Upload of data started ...',
        status_code: STATUS.PROGRESS,
      },
      to: ['logs'],
    });

    // Prepare upload
    const saveStream = new SaveStream({
      objectMode: true,
      client: firehose,
      index: INDEX,
      streamName: DELIVERY_STREAM_NAME,
    });

    const handleError = async (e, cb) => {
      await messenger.send({
        message: {
          computed_key: originalComputedKey,
          status_message: e.message,
          status_code: STATUS.ERROR,
        },
        to: ['logs'],
      });

      return cb(e);
    };

    const readStream = s3
      .getObject({
        Bucket: s3record.s3.bucket.name,
        Key: s3record.s3.object.key,
      })
      .createReadStream();

    return new Promise((resolve, reject) => {
      readStream
        .pipe(split2(JSON.parse))
        .on('error', async e => handleError(e, reject))
        .pipe(
          through2Batch.obj({ batchSize: 10 }, (batch, _, cb) => {
            const improvedBatch = batch.map(item => {
              const computedKey = s3record.s3.object.key;
              const projectId = item.project_id;

              const id = crypto
                .createHash('md5')
                .update(`${computedKey}/${projectId}`)
                .digest('hex');

              // Enhance item to save
              const itemEnhanced = Object.assign(
                {
                  id,
                  computed_key: computedKey,
                  created_by: s3record.userIdentity.principalId, // which service created the harmonized file
                  last_modified: data.LastModified.toISOString(), // ISO-8601 date
                  type: 'project',
                },
                item
              );

              return itemEnhanced;
            });

            return cb(null, improvedBatch);
          })
        )
        .on('error', async e => handleError(e, reject))
        .pipe(saveStream)
        .on('error', async e => handleError(e, reject))
        .on('finish', async () => {
          await messenger.send({
            message: {
              computed_key: originalComputedKey,
              status_message: 'Results uploaded successfully, all went well.',
              status_code: STATUS.INGESTED,
            },
            to: ['logs'],
          });

          const enrichmentTargetArn = `arn:aws:sns:${REGION}:${accountId}:${STAGE}-onEnrichmentRequested`;

          await sns
            .publish({
              Message: JSON.stringify({
                default: JSON.stringify(s3record.s3),
              }),
              MessageStructure: 'json',
              TargetArn: enrichmentTargetArn,
            })
            .promise();

          return resolve('Results queued for ingestion successfully.');
        });
    });
  } catch (err) {
    await messenger.send({
      message: {
        computed_key: originalComputedKey,
        status_message: err.message,
        status_code: STATUS.ERROR,
      },
      to: ['logs'],
    });

    return callback(err);
  }
};

export default handler;
