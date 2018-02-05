import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

import elasticsearch from 'elasticsearch';
import connectionClass from 'http-aws-es';
import through2 from 'through2';
import split2 from 'split2';

import deleteProjects from '../lib/deleteProjects';
import SaveStream from '../lib/SaveStream';

import Logger from '../../../../logger/listener/src/lib/Logger';

export const handler = async (event, context, callback) => {
  const { API, INDEX, REGION, STAGE } = process.env;

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

  // Get Account ID from lambda function arn in the context
  const accountId = context.invokedFunctionArn.split(':')[4];
  const sns = new AWS.SNS();
  const logger = new Logger({
    sns,
    targetArn: `arn:aws:sns:${REGION}:${accountId}:${STAGE}-onLogEmitted`,
    emitter: context.invokedFunctionArn,
  });

  /*
   * Extract information from the event
   */

  // Extract S3 record
  const s3record = JSON.parse(snsRecord.Sns.Message).Records[0];

  // Get original computed key (without '.ndjson')
  const originalComputedKey = s3record.s3.object.key.replace('.ndjson', '');

  try {
    await logger.info({
      message: {
        computed_key: originalComputedKey,
        status_message: 'Preparing the upload to ElasticSearch...',
      },
    });

    // s3 client instantiation
    const s3 = new AWS.S3();

    const data = await s3
      .headObject({
        Bucket: s3record.s3.bucket.name,
        Key: s3record.s3.object.key,
      })
      .promise();

    // elasticsearch client instantiation
    const client = elasticsearch.Client({
      host: `https://${API}`,
      apiVersion: '6.0',
      connectionClass,
      index: INDEX,
    });

    await deleteProjects({
      client,
      index: INDEX,
      key: s3record.s3.object.key,
    });

    await logger.info({
      message: {
        computed_key: originalComputedKey,
        status_message: 'Start uploading to ElasticSearch',
      },
    });

    // Prepare upload
    const saveStream = new SaveStream({
      objectMode: true,
      client,
      index: INDEX,
    });

    const onPipeError = async e =>
      logger.error({
        message: {
          computed_key: originalComputedKey,
          status_message: e.message,
        },
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
        await logger.info({
          message: {
            computed_key: originalComputedKey,
            status_message: 'Results uploaded successfully, all went well.',
          },
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

        return callback(null, 'Results uploaded successfully, all went well.');
      });
  } catch (err) {
    await logger.error({
      message: {
        computed_key: originalComputedKey,
        status_message: err.message,
      },
    });

    return callback(err.message);
  }
};

export default handler;
