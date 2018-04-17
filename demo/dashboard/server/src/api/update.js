const https = require('https');
const aws4 = require('aws4');
const url = require('url');

export const handler = (event, context, callback) => {
  const apiEndpoint = url.parse(`https://${process.env.SIGNED_UPLOADS_API}`);
  const endpoint = '/storage/update';
  const accessKeyId = process.env.PRODUCER_KEY_ID;
  const secretAccessKey = process.env.PRODUCER_SECRET_ACCESS_KEY;

  const producerKey =
    event.queryStringParameters && event.queryStringParameters.key
      ? event.queryStringParameters.key
      : undefined;

  if (!producerKey) {
    const response = {
      statusCode: 400,
      body: JSON.stringify({
        message: `Missing key parameter`,
      }),
    };

    return callback(null, response);
  }

  const params = {
    host: apiEndpoint.host,
    method: 'GET',
    path: `${apiEndpoint.pathname}${endpoint}`,
    headers: {
      'x-amz-meta-producer-key': producerKey,
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
        callback(null, {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*', // Required for CORS support to work
            'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
          },
          body: JSON.stringify({ signedUrl: JSON.parse(body) }),
        });
      });
    }
  );

  req.on('error', err => callback(err));

  return req.end();
};

export default handler;
