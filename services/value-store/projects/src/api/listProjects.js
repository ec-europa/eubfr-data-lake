import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

export const handler = (event, context, callback) => {
  console.log(event); // Contains incoming request data (e.g., query params, headers and more)
  console.log(context);

  // var params =
  const iam = new AWS.IAM();
  iam.listGroupsForUser(
    {
      UserName: event.requestContext.identity.userArn
        .split(':')[5]
        .replace('user/', ''),
    },
    (err, data) => {
      if (err) return console.log(err, err.stack); // an error occurred

      console.log(data); // successful response
      return data.Groups.some(group => group.GroupName === 'Administators');
    }
  );

  const documentClient = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10',
    convertEmptyValues: true,
  });

  const { TABLE } = process.env;

  const params = {
    TableName: TABLE,
    ProjectionExpression:
      'project_id, title, timeframe, eu_budget_contribution, description',
  };

  console.log('Scanning projects table.');

  const projects = [];

  function onScan(isRoot) {
    return (err, data) => {
      if (err) {
        callback(err);
      } else {
        // print all the movies
        console.log('Scan succeeded.');

        data.Items.forEach(project => {
          projects.push(project);
        });

        // continue scanning if we have more movies, because
        // scan can retrieve a maximum of 1MB of data
        if (typeof data.LastEvaluatedKey !== 'undefined') {
          console.log('Scanning for more...');
          params.ExclusiveStartKey = data.LastEvaluatedKey;
          documentClient.scan(params, onScan(false));
        }

        if (isRoot) {
          const response = {
            statusCode: 200,
            headers: {},
            body: JSON.stringify(projects),
          };

          callback(null, response);
        }
      }
    };
  }

  return documentClient.scan(params, onScan(true));
};

export default handler;
