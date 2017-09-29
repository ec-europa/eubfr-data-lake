export const handler = (event, context, cb) => {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
    },
    body: JSON.stringify({
      message:
        'Docroot is not used at the moment. Please check the other endpoints',
    }),
  };

  cb(null, response);
};
