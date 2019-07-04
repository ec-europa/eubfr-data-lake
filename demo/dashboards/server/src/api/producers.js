export const handler = async () => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support
      'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
    },
    body: JSON.stringify({
      message: 'List existing producers',
    }),
  };
};

export default handler;
