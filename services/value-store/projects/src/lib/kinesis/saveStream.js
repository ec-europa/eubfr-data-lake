import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

import through2Batch from 'through2-batch';
import split2 from 'split2';

import { STATUS } from '@eubfr/logger-messenger/src/lib/status';

import SaveStreamInstance from './SaveStreamClass';

const saveToElasticSearch = async ({ clients, usefulData, handleError }) => {
  const { env, s3record, fileData, originalComputedKey } = usefulData;

  const { INDEX, KINESIS_STREAM } = env;

  const kinesis = new AWS.Kinesis();

  // Prepare save stream
  const saveStream = new SaveStreamInstance({
    objectMode: true,
    client: kinesis,
    index: INDEX,
    kinesisStream: KINESIS_STREAM,
  });

  const readStream = clients.s3
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
          const improvedBatch = batch.map(item =>
            Object.assign(
              {
                computed_key: s3record.s3.object.key,
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
        await clients.messenger.send({
          message: {
            computed_key: originalComputedKey,
            status_message: 'Results queued to Kinesis for ingestion!',
            status_code: STATUS.INGESTED,
          },
          to: ['logs'],
        });

        return resolve('Results queued to Kinesis for ingestion!');
      });
  });
};

export default saveToElasticSearch;
