import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import { checkAccess } from '../lib/checkAccess';
import { extractUsername } from '../lib/extractUsername';

export const handler = (event, context, callback) => {
  const { userArn } = event.requestContext.identity;
  const username = extractUsername(userArn);

  checkAccess(username).then(accessGranted => {
    if (!accessGranted) {
      return callback(null, {
        statusCode: 403,
        body: JSON.stringify({
          message:
            'Access denied. You have to be a member of the "Producers" group.',
        }),
      });
    }

    const file =
      event.headers && event.headers['x-amz-meta-computed-key']
        ? event.headers['x-amz-meta-computed-key']
        : undefined;

    if (!file) {
      const response = {
        statusCode: 400,
        body: JSON.stringify({
          error: `Missing x-amz-meta-computed-key header`,
        }),
      };

      return callback(null, response);
    }

    if (!file.startsWith(username)) {
      const response = {
        statusCode: 400,
        body: JSON.stringify({
          error: `You can't access a file you don't own.`,
        }),
      };

      return callback(null, response);
    }

    const documentClient = new AWS.DynamoDB.DocumentClient();

    const { TABLE } = process.env;

    // Only return results for the current producer
    const params = {
      TableName: TABLE,
      ProjectionExpression:
        'computed_key, content_type, original_key, message, metadata, last_modified, content_length, #status',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      KeyConditionExpression: 'computed_key = :computed_key',
      ExpressionAttributeValues: { ':computed_key': file },
    };

    return documentClient.query(params, (err, data) => {
      if (err) {
        return callback(err);
      }

      const response = {
        statusCode: 200,
        headers: {},
        body: JSON.stringify(data.Items),
      };

      return callback(null, response);
    });
  });
};

export default handler;
