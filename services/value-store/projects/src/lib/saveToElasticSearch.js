import through2 from 'through2';
import split2 from 'split2';

import { STATUS } from '@eubfr/logger-messenger/src/lib/status';

import SaveStream from '../lib/SaveStream';

const saveToElasticSearch = async ({ clients, usefulData, handleError }) => {
  const {
    env,
    s3record,
    fileData,
    originalComputedKey,
    accountId,
  } = usefulData;

  const { INDEX, REGION, STAGE } = env;

  // Prepare save stream
  const saveStream = new SaveStream({
    objectMode: true,
    client: clients.clientElasticSearch,
    index: INDEX,
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
        through2.obj((chunk, enc, cb) => {
          // Enhance item to save
          const item = Object.assign(
            {
              computed_key: s3record.s3.object.key,
              created_by: s3record.userIdentity.principalId, // which service created the harmonized file
              last_modified: fileData.LastModified.toISOString(), // ISO-8601 date
            },
            chunk
          );

          return cb(null, item);
        })
      )
      .on('error', async e => handleError(e, reject))
      .pipe(saveStream)
      .on('error', async e => handleError(e, reject))
      .on('finish', async () => {
        await clients.messenger.send({
          message: {
            computed_key: originalComputedKey,
            status_message: 'Results uploaded successfully, all went well.',
            status_code: STATUS.INGESTED,
          },
          to: ['logs'],
        });

        const enrichmentTargetArn = `arn:aws:sns:${REGION}:${accountId}:${STAGE}-onEnrichmentRequested`;

        await clients.sns
          .publish({
            Message: JSON.stringify({
              default: JSON.stringify(s3record.s3),
            }),
            MessageStructure: 'json',
            TargetArn: enrichmentTargetArn,
          })
          .promise();

        return resolve('Results uploaded successfully, all went well.');
      });
  });
};

export default saveToElasticSearch;
