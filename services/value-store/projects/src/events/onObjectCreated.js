import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

import elasticsearch from 'elasticsearch';
import connectionClass from 'http-aws-es';
import through2Batch from 'through2-batch';
import split2 from 'split2';

import MessengerFactory from '@eubfr/logger-messenger/src/lib/MessengerFactory';
import { STATUS } from '@eubfr/logger-messenger/src/lib/status';

import deleteProjects from '../lib/deleteProjects';
import SaveStream from '../lib/SaveStream';

export const handler = async (event, context, callback) => {
  const { API, INDEX, REGION, STAGE, BATCH_SIZE } = process.env;

  if (!API || !INDEX || !REGION || !STAGE || !BATCH_SIZE) {
    return callback(new Error('Missing environment variable!'));
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

  // Insantiate clients
  const client = elasticsearch.Client({
    host: `https://${API}`,
    apiVersion: '6.2',
    connectionClass,
    index: INDEX,
  });

  const messenger = MessengerFactory.Create({ context });
  const s3 = new AWS.S3();

  /*
   * Extract information from the event
   */

  // Extract S3 record
  const s3record = JSON.parse(snsRecord.Sns.Message).Records[0];

  // Extract file name and bucket from s3record.
  const { key } = s3record.s3.object;
  const bucket = s3record.s3.bucket.name;

  // Get original computed key (without '.ndjson')
  const originalComputedKey = key.replace('.ndjson', '');

  try {
    await messenger.send({
      message: {
        computed_key: originalComputedKey,
        status_message: 'Preparing the upload to ElasticSearch...',
        status_code: STATUS.PROGRESS,
      },
      to: ['logs'],
    });

    const data = await s3.headObject({ Bucket: bucket, Key: key }).promise();

    await deleteProjects({ client, index: INDEX, key });

    await messenger.send({
      message: {
        computed_key: originalComputedKey,
        status_message: 'Start uploading to ElasticSearch',
        status_code: STATUS.PROGRESS,
      },
      to: ['logs'],
    });

    // Prepare upload
    const saveStream = new SaveStream({
      objectMode: true,
      client,
      index: INDEX,
    });

    const handleError = async (e, cb) => {
      // callback cb is reject of a promise
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
      .getObject({ Bucket: bucket, Key: key })
      .createReadStream();

    return new Promise((resolve, reject) =>
      readStream
        .pipe(split2(JSON.parse))
        .on('error', async e => handleError(e, reject))
        .pipe(
          through2Batch.obj({ batchSize: BATCH_SIZE }, (batch, _, cb) => {
            const improvedBatch = batch.map(item =>
              Object.assign(
                {
                  computed_key: key,
                  created_by: s3record.userIdentity.principalId, // which service created the harmonized file
                  last_modified: data.LastModified.toISOString(), // ISO-8601 date,
                  producer_id: key.split('/')[0],
                },
                item
              )
            );

            saveStream.write(improvedBatch, cb);
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

          return resolve('Results uploaded successfully, all went well.');
        })
    );
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
