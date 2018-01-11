import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

export const STATUS = {
  ERROR: 'error',
  UPLOADED: 'uploaded',
  PARSING: 'parsing',
  PARSED: 'parsed',
};

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
  if (
    !snsRecord ||
    !snsRecord.EventSubscriptionArn ||
    snsRecord.EventSource !== 'aws:sns'
  ) {
    return callback('Bad record');
  }

  /*
   * Extract information from the event
   */

  // Extract S3 record
  const snsMessage = JSON.parse(snsRecord.Sns.Message);
  const { key, status, message } = snsMessage;
  const producerId = key.split('/')[0];

  // Save record
  const documentClient = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10',
  });

  const params = {
    TableName: process.env.TABLE,
    Key: {
      producer_id: producerId,
      computed_key: key,
    },
    UpdateExpression: 'SET #status = :s, message = :m',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: {
      ':s': status,
      ':m': message,
    },
  };

  return documentClient.update(params, dynamoErr => {
    if (dynamoErr) return callback(dynamoErr);

    return callback(null, 'All fine');
  });
};

export default handler;
