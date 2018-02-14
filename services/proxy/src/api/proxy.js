export const handler = (event, context, callback) => {
  console.log(`The event`);
  console.log(JSON.stringify(event));
  console.log(`The context`);
  console.log(JSON.stringify(context));
  // make some checks before allow the request

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support
      'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
    },
    body: JSON.stringify({
      message: 'WIP',
    }),
  };

  callback(null, response);
};

export default handler;
