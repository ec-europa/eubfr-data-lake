import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import aws4 from 'aws4';
import https from 'https';
import url from 'url';

export const handler = async (event, context, callback) => {
  const { PRODUCER_SECRET_NAME, DELETER_API } = process.env;

  const apiEndpoint = url.parse(`https://${DELETER_API}`);
  const endpoint = '/storage/delete';

  const secretsManager = new AWS.SecretsManager();
  const secretsResponse = secretsManager
    .getSecretValue({ SecretId: PRODUCER_SECRET_NAME })
    .promise();

  const secrets = JSON.parse(secretsResponse.SecretString);

  const {
    AWS_ACCESS_KEY_ID: accessKeyId,
    AWS_SECRET_ACCESS_KEY: secretAccessKey,
  } = secrets;

  const computedKey =
    event.queryStringParameters && event.queryStringParameters.key
      ? event.queryStringParameters.key
      : undefined;

  if (!computedKey) {
    const response = {
      statusCode: 400,
      body: JSON.stringify({
        message: `Missing key parameter`,
      }),
    };

    return callback(null, response);
  }

  // https://f9pwfxauvg.execute-api.eu-central-1.amazonaws.com/huartya17

  const params = {
    host: apiEndpoint.host,
    method: 'GET',
    path: `${apiEndpoint.pathname}${endpoint}`,
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

        // Response headers
        const headers = {
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
          'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
        };

        if (statusCode === 200) {
          return callback(null, {
            statusCode: 200,
            headers,
            body,
          });
        }

        return callback(null, {
          statusCode: 400,
          headers,
          body: JSON.stringify({ Error: JSON.parse(body) }),
        });
      });
    }
  );

  req.on('error', err => callback(err));

  return req.end();
};

export default handler;
