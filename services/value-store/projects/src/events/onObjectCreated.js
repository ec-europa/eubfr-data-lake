import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

import elasticsearch from 'elasticsearch';
import connectionClass from 'http-aws-es';
import through2 from 'through2';
import split2 from 'split2';

import MessengerFactory from '@eubfr/logger-messenger/src/lib/MessengerFactory';
import { STATUS } from '@eubfr/logger-messenger/src/lib/status';

import deleteProjects from '../lib/deleteProjects';
import SaveStream from '../lib/SaveStream';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export const handler = async (event, context, callback) => {
  const { API, INDEX } = process.env;

  if (!API || !INDEX) {
    return callback(
      new Error('API and INDEX environment variables are required!')
    );
  }

  /*
   * Some checks here before going any further
   */
  if (!event.Records) {
    return callback('No record');
  }

  // Only work on the first record
  const snsRecord = event.Records[0];

  // Was the lambda triggered correctly? Is the file extension supported? etc.
  if (!snsRecord || snsRecord.EventSource !== 'aws:sns') {
    return callback('Bad record');
  }

  // Insantiate clients
  const client = elasticsearch.Client({
    host: `https://${API}`,
    apiVersion: '6.0',
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

  // Get original computed key (without '.ndjson')
  const originalComputedKey = s3record.s3.object.key.replace('.ndjson', '');

  try {
    await messenger.send({
      message: {
        computed_key: originalComputedKey,
        status_message: 'Preparing the upload to ElasticSearch...',
        status_code: STATUS.PROGRESS,
      },
      to: ['logs', 'meta'],
    });

    const data = await s3
      .headObject({
        Bucket: s3record.s3.bucket.name,
        Key: s3record.s3.object.key,
      })
      .promise();

    await deleteProjects({
      client,
      index: INDEX,
      key: s3record.s3.object.key,
    });

    // Avoid conflict with another SNS.
    await delay(5000);

    await messenger.send({
      message: {
        computed_key: originalComputedKey,
        status_message: 'Start uploading to ElasticSearch',
        status_code: STATUS.PROGRESS,
      },
      to: ['logs', 'meta'],
    });

    // Prepare upload
    const saveStream = new SaveStream({
      objectMode: true,
      client,
      index: INDEX,
    });

    const onPipeError = async e =>
      messenger.send({
        message: {
          computed_key: originalComputedKey,
          status_message: e.message,
          status_code: STATUS.ERROR,
        },
        to: ['logs', 'meta'],
      });

    return s3
      .getObject({
        Bucket: s3record.s3.bucket.name,
        Key: s3record.s3.object.key,
      })
      .createReadStream()
      .pipe(split2(JSON.parse))
      .on('error', onPipeError)
      .pipe(
        through2.obj((chunk, enc, cb) => {
          // Enhance item to save
          const item = Object.assign(
            {
              computed_key: s3record.s3.object.key,
              created_by: s3record.userIdentity.principalId, // which service created the harmonized file
              last_modified: data.LastModified.toISOString(), // ISO-8601 date
            },
            chunk
          );

          return cb(null, item);
        })
      )
      .on('error', onPipeError)
      .pipe(saveStream)
      .on('error', onPipeError)
      .on('finish', async () => {
        await messenger.send({
          message: {
            computed_key: originalComputedKey,
            status_message: 'Results uploaded successfully, all went well.',
            status_code: STATUS.INGESTED,
          },
          to: ['logs', 'meta'],
        });

        return callback(null, 'Results uploaded successfully, all went well.');
      });
  } catch (err) {
    await messenger.send({
      message: {
        computed_key: originalComputedKey,
        status_message: err.message,
        status_code: STATUS.ERROR,
      },
      to: ['logs', 'meta'],
    });

    return callback(err.message);
  }
};

export default handler;
