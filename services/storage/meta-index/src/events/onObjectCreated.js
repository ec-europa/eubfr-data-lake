import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

export const handler = (event, context, callback) => {
  /*
   * Some checks here before going any further
   */

  if (!event.Records) {
    return callback('No record');
  }

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

  // Retrieve file meta
  const s3 = new AWS.S3();

  return s3.headObject(
    {
      Bucket: s3record.s3.bucket.name,
      Key: s3record.s3.object.key,
    },
    (err, data) => {
      if (err) return callback(err); // an error occurred

      // Save record
      const documentClient = new AWS.DynamoDB.DocumentClient({
        apiVersion: '2012-08-10',
        convertEmptyValues: true,
      });

      const params = {
        TableName: process.env.TABLE,
        Item: {
          computed_key: s3record.s3.object.key,
          event_time: s3record.eventTime,
          producer_id: s3record.userIdentity.principalId,
          content_type: data.ContentType,
          last_modified: data.LastModified.toISOString(), // ISO-8601 date
          content_length: data.ContentLength,
          metadata: data.Metadata,
        },
      };

      return documentClient.put(params, dynamoErr => {
        if (dynamoErr) return callback(dynamoErr);

        return callback(null, 'All fine');
      });
    }
  );
};

export default handler;
