/* eslint-disable import/prefer-default-export, no-console */
const AWS = require('aws-sdk');

export const onCreate = (event, context, callback) => {
  // Contains incoming request data (e.g., query params, headers and more)
  console.log('event', event);
  console.log('context', context);

  // Get Account ID from lambda function arn in the context
  const accountId = context.invokedFunctionArn.split(':')[4];

  // Get stage from environment variables
  const stage = process.env.STAGE;

  // Some logic here
  const endpointArn = `arn:aws:sns:eu-central-1:${accountId}:${stage}-etl-budg-csv`;

  // Send SNS message
  const sns = new AWS.SNS();

  const payload = {
    default: JSON.stringify({
      test: 'Hello',
    }),
  };

  sns.publish(
    {
      Message: JSON.stringify(payload),
      MessageStructure: 'json',
      TargetArn: endpointArn,
    },
    (err, data) => {
      if (err) {
        console.log(err.stack);
        return;
      }

      console.log('push sent');
      console.log(data);

      const response = {
        statusCode: 200,
        headers: {
          'x-custom-header': 'My Header Value',
        },
        body: JSON.stringify({ data }),
      };

      callback(null, response);
    }
  );
};
