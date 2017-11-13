import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

import elasticsearch from 'elasticsearch';
import connectionClass from 'http-aws-es';
import through2 from 'through2';
import split2 from 'split2';

import deleteProjects from '../lib/deleteProjects';
import SaveStream from '../lib/SaveStream';

export const handler = (event, context, callback) => {
  const { API, INDEX } = process.env;
  const type = `project`;

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

  /*
   * Extract information from the event
   */

  // Extract S3 record
  const s3record = JSON.parse(snsRecord.Sns.Message).Records[0];

  // s3 client instantiation
  const s3 = new AWS.S3();

  // elasticsearch client configuration
  const options = {
    host: `https://${API}`,
    connectionClass,
    log: 'trace',
    index: INDEX,
  };

  // elasticsearch mapping overrides/corrections
  // the rest of the fields are dynamically discovered fine for now
  const body = {
    project: {
      properties: {
        project_locations: {
          properties: {
            location: { type: 'geo_point' },
          },
        },
      },
    },
  };

  // elasticsearch client instantiation
  const client = elasticsearch.Client(options);

  return client.indices
    .create({ index: INDEX })
    .catch(e => {
      // There will possibly be an existing index.
      // But for the mapping to work, the index has to be ensured before.
      // If you find a more elegant ES API function, feel free to change.
      console.log(e);
      return true;
    })
    .then(() => client.indices.putMapping({ index: INDEX, type, body }))
    .then(() =>
      s3
        .headObject({
          Bucket: s3record.s3.bucket.name,
          Key: s3record.s3.object.key,
        })
        .promise()
        .then(data => {
          deleteProjects({
            client,
            index: INDEX,
            key: s3record.s3.object.key,
          });

          return data;
        })
        .then(data => {
          const saveStream = new SaveStream({
            objectMode: true,
            client,
            index: INDEX,
          });

          return s3
            .getObject({
              Bucket: s3record.s3.bucket.name,
              Key: s3record.s3.object.key,
            })
            .createReadStream()
            .pipe(split2(JSON.parse))
            .pipe(
              through2.obj((chunk, enc, cb) => {
                // Enhance item to save
                const item = Object.assign(
                  {
                    computed_key: s3record.s3.object.key,
                    producer_id: s3record.userIdentity.principalId,
                    last_modified: data.LastModified.toISOString(), // ISO-8601 date
                  },
                  chunk
                );

                return cb(null, item);
              })
            )
            .pipe(saveStream);
        })
    )
    .catch(err => callback(err));
};

export default handler;
