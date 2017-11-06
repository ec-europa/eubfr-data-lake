import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

export const handler = (event, context, callback) => {
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

  const computedKey = s3record.s3.object.key;
  const producerId = computedKey.split('/')[0];

  const params = {
    TableName: process.env.TABLE,
    Key: {
      producer_id: producerId,
      computed_key: computedKey,
    },
  };

  return documentClient.delete(params, dynamoErr => {
    if (dynamoErr) return callback(dynamoErr);

    return callback(null, 'All fine');
  });
};

export default handler;
