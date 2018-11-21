import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import aws4 from 'aws4';
import url from 'url';

import request from '../lib/request';

export const handler = async event => {
  const { PRODUCER_SECRET_NAME, SIGNED_UPLOADS_API } = process.env;

  const apiEndpoint = url.parse(`https://${SIGNED_UPLOADS_API}`);
  const endpoint = '/storage/download';

  const secretsManager = new AWS.SecretsManager();
  const secretsResponse = await secretsManager
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
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: `Missing key parameter`,
      }),
    };
  }

  const params = {
    host: apiEndpoint.host,
    method: 'GET',
    path: `${apiEndpoint.pathname}${endpoint}`,
    headers: {
      'x-amz-meta-computed-key': computedKey,
    },
  };

  try {
    const download = await request(
      aws4.sign(params, {
        accessKeyId,
        secretAccessKey,
      })
    );

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify({ download }),
    };
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: e.message,
      }),
    };
  }
};

export default handler;
