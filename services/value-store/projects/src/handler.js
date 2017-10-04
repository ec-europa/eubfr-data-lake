import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import through2 from 'through2';
import split2 from 'split2';

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

  console.log(s3record.s3);

  return s3.headObject(
    {
      Bucket: s3record.s3.bucket.name,
      Key: s3record.s3.object.key,
    },
    (err, data) => {
      if (err) return callback(err); // an error occurred

      return s3
        .getObject({
          Bucket: s3record.s3.bucket.name,
          Key: s3record.s3.object.key,
        })
        .createReadStream()
        .pipe(split2(JSON.parse))
        .pipe(
          through2.obj((chunk, enc, cb) => {
            console.log('CHUNK\r\n');
            console.log(chunk);

            const params = {
              TableName: TABLE,
              Item: {
                computed_key: s3record.s3.object.key,
                producer_id: s3record.userIdentity.principalId,
                last_modified: data.LastModified.toISOString(), // ISO-8601 date
                ...chunk,
              },
            };

            return documentClient.put(params, dynamoErr => {
              if (dynamoErr) return cb(dynamoErr);

              console.log('chunk saved\n');

              // return callback(null, 'All fine');
              return cb(null, chunk);
            });
          })
        );
    }
  );
};

export const onObjectRemoved = (event, context, callback) => {
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

  // Delete record
  const documentClient = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10',
  });

  const params = {
    TableName: process.env.TABLE,
    Key: {
      computed_key: s3record.s3.object.key,
    },
  };

  return documentClient.delete(params, dynamoErr => {
    if (dynamoErr) return callback(dynamoErr);

    return callback(null, 'All fine');
  });
};
