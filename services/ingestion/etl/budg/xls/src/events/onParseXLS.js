import path from 'path';
import stream from 'stream';
import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
//import parse from 'xlsx';
import transform from 'stream-transform';

import transformRecord from '../lib/transform';

// Destination bucket
const { BUCKET } = process.env;

export const handler = (event, context, callback) => {
  /*
   * Some checks here before going any further
   */

  // Only work on the first record
  const snsRecord = event.Records[0];

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
  if (path.extname(message.object.key) !== '.xls') {
    return callback('File extension should be .xls');
  }

  const s3 = new AWS.S3();

  /*
   * Configure the pipeline
   */

  // Parse
  if(typeof require !== 'undefined') XLSX = require('xlsx');
  var workbook = XLSX.readFile('projects.xls');
  var sheet_name_list = workbook.SheetNames;
  const parser = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

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

export default handler;
