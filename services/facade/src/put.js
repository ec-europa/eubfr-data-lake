/* eslint-disable import/prefer-default-export, no-console */
export const handler = (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      'x-custom-header': 'My Header Value',
    },
    body: JSON.stringify({ message: 'Hello World!' }),
  };

  callback(null, response);
};
