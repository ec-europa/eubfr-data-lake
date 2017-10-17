export const handler = (event, context, cb) => {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support
      'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
    },
    body: JSON.stringify({
      message:
        'GraphQL placeholder',
    }),
  };

  cb(null, response);
};

export default handler;
