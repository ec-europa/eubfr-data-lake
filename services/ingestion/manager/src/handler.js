/* eslint-disable import/prefer-default-export, no-console */
const AWS = require('aws-sdk');

export const onCreate = (event, context, callback) => {
  // Contains incoming request data (e.g., query params, headers and more)
  console.log('event', event);
  console.log('context', context);

  // Some logic here

  // Send SNS message
  const sns = new AWS.SNS();
  const endpointArn = 'arn:aws:sns:eu-central-1:491621799026:test-huartya';
  const payload = {
    default: JSON.stringify({
      test: 'Hello',
      records: event.Records,
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
