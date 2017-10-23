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
      FilterExpression: 'begins_with(computed_key, :producer)',
      ExpressionAttributeValues: { ':producer': `${username}/` },
    };

    const files = [];

    function onScan(isRoot) {
      return (err, data) => {
        if (err) {
          callback(err);
        } else {
          data.Items.forEach(project => {
            files.push(project);
          });

          // continue scanning if we have more movies, because
          // scan can retrieve a maximum of 1MB of data
          if (typeof data.LastEvaluatedKey !== 'undefined') {
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            documentClient.scan(params, onScan(false));
          }

          if (isRoot) {
            const response = {
              statusCode: 200,
              headers: {},
              body: JSON.stringify(files),
            };

            callback(null, response);
          }
        }
      };
    }

    return documentClient.scan(params, onScan(true));
  });
};

export default handler;
