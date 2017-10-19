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
  console.log(JSON.parse(snsRecord.Sns.Message));
  const computedKey = JSON.parse(snsRecord.Sns.Message).Records[0];

  // Save record
  const documentClient = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10',
    convertEmptyValues: true,
  });

  const params = {
    TableName: process.env.TABLE,
    Key: { computed_key: computedKey },
    UpdateExpression: 'set #a = :x',
    ExpressionAttributeNames: { '#a': 'status' },
    ExpressionAttributeValues: {
      ':x': 'parsed',
    },
  };

  return documentClient.uodate(params, dynamoErr => {
    if (dynamoErr) return callback(dynamoErr);

    return callback(null, 'All fine');
  });
};

export default handler;
