/* eslint-disable import/prefer-default-export, no-console */
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

export const onObjectCreated = (event, context, callback) => {
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
   * Extract information from the event
   */

  // Extract S3 record
  const s3record = JSON.parse(snsRecord.Sns.Message).Records[0];

  // Retrieve file meta
  const s3 = new AWS.S3();

  return s3.headObject(
    {
      Bucket: s3record.s3.bucket.name,
      Key: s3record.s3.object.key,
    },
    (err, data) => {
      if (err) return callback(err); // an error occurred

      console.log({
        Bucket: s3record.s3.bucket.name,
        Key: s3record.s3.object.key,
      });
      console.log(JSON.stringify(data));
      return callback(null, 'All fine');
    }
  );

  // Save record
  // dynamodb
};
