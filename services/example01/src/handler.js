/* eslint-disable import/prefer-default-export, no-console */
import getMessage from './message';

export const hello = (event, context, callback) => {
  console.log(event); // Contains incoming request data (e.g., query params, headers and more)

  const { name } = event.pathParameters || { name: 'World' };

  const response = {
    statusCode: 200,
    headers: {
      'x-custom-header': 'My Header Value',
    },
    body: JSON.stringify({ message: getMessage(name) }),
  };

  callback(null, response);
};
