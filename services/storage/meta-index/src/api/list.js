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

    const params = {
      TableName: TABLE,
      ProjectionExpression:
        'producer_id, computed_key, content_type, original_key, message, metadata, last_modified, content_length, #status',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      KeyConditionExpression: 'producer_id = :pid',
      ExpressionAttributeValues: {
        ':pid': username,
      },
    };

    const files = [];

    function onQuery(isRoot) {
      return (err, data) => {
        if (err) {
          callback(err);
        } else {
          data.Items.forEach(project => {
            files.push(project);
          });

          // continue querying if we have more movies, because
          // query can retrieve a maximum of 1MB of data
          if (typeof data.LastEvaluatedKey !== 'undefined') {
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            documentClient.query(params, onQuery(false));
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

    return documentClient.query(params, onQuery(true));
  });
};

export default handler;
