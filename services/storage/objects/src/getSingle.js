export const handler = (event, context, callback) => {
  console.log(`---------------------------------------------------`);
  console.log(`Logging event`);
  console.log(event);
  console.log(`---------------------------------------------------`);
  console.log(`Logging context`);
  console.log(context);

  const response = {
    statusCode: 200,
    headers: {
      'x-custom-header': 'My Header Value',
    },
    body: JSON.stringify({ message: 'Get a single project' }),
  };

  callback(null, response);
};
