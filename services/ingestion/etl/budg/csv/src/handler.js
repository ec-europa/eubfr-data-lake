/* eslint-disable import/prefer-default-export, no-console */
export const parseCsv = (event, context, callback) => {
  // Contains incoming request data (e.g., query params, headers and more)
  console.log('event', event);
  console.log('context', context);

  const response = {
    statusCode: 200,
    headers: {
      'x-custom-header': 'BUDG CSV ETL',
    },
    body: JSON.stringify({ Hello: 'world!!!!!' }),
  };

  callback(null, response);
};
