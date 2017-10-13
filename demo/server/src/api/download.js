const https = require('https');
const aws4 = require('aws4');

export const handler = (event, context, callback) => {
  const region = process.env.REGION;
  const apiGatewayId = process.env.SIGNED_UPLOADS_API_ID;
  const stage = process.env.STAGE;
  const endpoint = '/storage/download';
  const accessKeyId = process.env.PRODUCER_KEY_ID;
  const secretAccessKey = process.env.PRODUCER_SECRET_ACCESS_KEY;

  // User must pass the "x-amz-meta-computed-key" header
  const computedKey =
    event.headers && event.headers['x-amz-meta-computed-key']
      ? event.headers['x-amz-meta-computed-key']
      : undefined;

  if (!computedKey) {
    const response = {
      statusCode: 400,
      body: JSON.stringify({
        message: `Missing x-amz-meta-computed-key header`,
      }),
    };

    return callback(null, response);
  }

  const params = {
    host: `${apiGatewayId}.execute-api.${region}.amazonaws.com`,
    method: 'GET',
    path: `/${stage}${endpoint}`,
    headers: {
      'x-amz-meta-computed-key': computedKey,
    },
  };

  // can specify any custom option or header as per usual
  const req = https.request(
    aws4.sign(params, {
      accessKeyId,
      secretAccessKey,
    }),
    res => {
      res.setEncoding('utf8');
      let body = '';

      res.on('data', data => {
        body += data;
      });

      res.on('end', () => {
        const { statusCode } = res;

        if (statusCode === 200) {
          return callback(null, {
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': '*', // Required for CORS support to work
              'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
            },
            body: JSON.stringify({ signedUrl: JSON.parse(body) }),
          });
        }

        return callback(null, {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*', // Required for CORS support to work
            'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
          },
          body: JSON.stringify({ Error: JSON.parse(body) }),
        });
      });
    }
  );

  req.on('error', err => callback(err));

  return req.end();
};

export default handler;
