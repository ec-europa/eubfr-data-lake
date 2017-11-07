import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

export const handler = (event, context, callback) => {
  // API to work with
  const { API } = process.env;

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

  const s3 = new AWS.S3();

  // Retrieve file meta
  return s3.headObject({
    Bucket: s3record.s3.bucket.name,
    Key: s3record.s3.object.key,
  });
};

export default handler;
