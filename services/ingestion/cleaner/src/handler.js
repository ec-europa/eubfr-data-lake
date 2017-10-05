/* eslint-disable import/prefer-default-export, no-console */
import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

const { BUCKET } = process.env;

export const onObjectRemoved = (event, context, callback) => {
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
   * Extract information from the event
   */

  // Extract S3 record
  const s3record = JSON.parse(snsRecord.Sns.Message).Records[0];

  const s3 = new AWS.S3();

  const params = {
    Bucket: BUCKET,
    Key: `${s3record.s3.object.key}.ndjson`,
  };
  console.log('params', params);

  return s3.deleteObject(params, err => {
    if (err) {
      callback(err);
      return;
    }

    callback(null, 'object removed');
  });
};
