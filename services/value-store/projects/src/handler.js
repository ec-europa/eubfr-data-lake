import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import through2 from 'through2';
import split2 from 'split2';
import SaveStream from './lib/SaveStream';

const { TABLE } = process.env;

export const onObjectCreated = (event, context, callback) => {
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

  // Retrieve file meta
  const s3 = new AWS.S3();

  // Save record
  const documentClient = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10',
    convertEmptyValues: true,
  });

  return s3.headObject(
    {
      Bucket: s3record.s3.bucket.name,
      Key: s3record.s3.object.key,
    },
    (err, data) => {
      if (err) return callback(err); // an error occurred

      const saveStream = new SaveStream({
        objectMode: true,
        documentClient,
        table: TABLE,
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
            const item = {
              computed_key: s3record.s3.object.key,
              producer_id: s3record.userIdentity.principalId,
              last_modified: data.LastModified.toISOString(), // ISO-8601 date
              ...chunk,
            };

            return cb(null, item);
          })
        )
        .pipe(saveStream);
    }
  );
};

export const onObjectRemoved = (event, context, callback) => {
  // To be implemented
  console.log(event);
  return callback();
};
