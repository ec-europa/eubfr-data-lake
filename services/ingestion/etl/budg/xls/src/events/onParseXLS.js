import path from 'path';
import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

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
  const XLSX = require('xlsx');

  // Get file
  const file = s3
    .getObject({
      Bucket: message.bucket.name,
      Key: message.object.key
    })
    .createReadStream();

  // Put data in buffer
  const buffers = [];
  file.on('data', function(data) {
    buffers.push(data);
  });

  // Manage data
  file.on('end', function() {
    // Parse file
    const buffer = Buffer.concat(buffers);
    const workbook = XLSX.read(buffer);
    const sheet_name_list = workbook.SheetNames;
    const parser =
      XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    console.log(parser);

    for (let i= 0; i < parser.length; i++) {
      // Transform data
      console.log(parser[i]);
      const data = transformRecord(parser[i]);
      console.log(data);

      // Load data
      const params = {
        Bucket: BUCKET,
        Key: `${message.object.key}.ndjson`,
        Body: data,
        ContentType: 'application/x-ndjson',
      };

      s3.upload(params, err => {
        console.log('upload');
        if (err) {
          callback(err);
        }
      });
    };
  });

  return;
};

export default handler;
