import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

import through2Batch from 'through2-batch';
import split2 from 'split2';

import { STATUS } from '@eubfr/logger-messenger/src/lib/status';

import SaveStreamInstance from './SaveStreamClass';

const saveToElasticSearch = async ({ clients, usefulData, handleError }) => {
  const { s3, messenger } = clients;
  const { env, s3record, originalComputedKey } = usefulData;

  const { INDEX, KINESIS_STREAM, BATCH_SIZE } = env;

  const kinesis = new AWS.Kinesis();
  const { key } = s3record.s3.object;
  const bucket = s3record.s3.bucket.name;

  // Prepare save stream
  const saveStream = new SaveStreamInstance({
    objectMode: true,
    client: kinesis,
    index: INDEX,
    kinesisStream: KINESIS_STREAM,
  });

  const fileData = await s3.headObject({ Bucket: bucket, Key: key }).promise();

  const readStream = s3
    .getObject({ Bucket: bucket, Key: key })
    .createReadStream();

  return new Promise((resolve, reject) => {
    const successMessage = 'Results uploaded successfully, all went well.';

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
                last_modified: fileData.LastModified.toISOString(), // ISO-8601 date
              },
              item
            )
          );

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
            status_message: successMessage,
            status_code: STATUS.INGESTED,
          },
          to: ['logs'],
        });

        return resolve(successMessage);
      });
  });
};

export default saveToElasticSearch;
