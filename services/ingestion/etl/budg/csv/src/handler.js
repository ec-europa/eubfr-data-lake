/* eslint-disable import/prefer-default-export, no-console */
import path from 'path';
import stream from 'stream';
import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import parse from 'csv-parse';
import transform from 'stream-transform';

import transformRecord from './transform';

// Destination bucket
const { BUCKET } = process.env;

export const parseCsv = (event, context, callback) => {
  /*
   * Some checks here before going any further
   */

  // Only work on the first record
  const snsRecord = event.Records ? event.Records[0] : undefined;

  // Was the lambda triggered correctly? Is the file extension supported? etc.
  if (!snsRecord || snsRecord.EventSource !== 'aws:sns') {
    return callback('Bad record');
  }

  /*
   * Prepare file analysis
   */

  // Extract message
  const message = JSON.parse(snsRecord.Sns.Message);

  // Check file extension
  if (path.extname(message.object.key) !== '.csv') {
    return callback('File extension should be .csv');
  }

  const s3 = new AWS.S3();

  /*
   * Configure the pipeline
   */

  // Parse
  const parser = parse({ columns: true });

  // Transform
  const transformer = transform(
    (record, cb) => {
      const data = transformRecord(record);
      cb(null, `${JSON.stringify(data)}\n`);
    },
    { parallel: 10 }
  );

  // Load
  const uploadFromStream = () => {
    const pass = new stream.PassThrough();

    const params = {
      Bucket: BUCKET,
      Key: `${message.object.key}.ndjson`,
      Body: pass,
      ContentType: 'application/x-ndjson',
    };

    s3.upload(params, err => {
      if (err) {
        callback(err);
      }
    });

    return pass;
  };

  /*
   * Start the hard work
   */

  return s3
    .getObject({
      Bucket: message.bucket.name,
      Key: message.object.key,
    })
    .createReadStream()
    .pipe(parser)
    .pipe(transformer)
    .pipe(uploadFromStream());
};
