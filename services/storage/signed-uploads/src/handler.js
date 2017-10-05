/* eslint-disable import/prefer-default-export */

import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

const bucket = process.env.BUCKET;
const region = process.env.REGION;

const s3 = new AWS.S3({ signatureVersion: 'v4', region });

export const onProjectsUpsert = (event, context, callback) => {
  const file =
    event.headers && event.headers['x-amz-meta-producer-key']
      ? event.headers['x-amz-meta-producer-key']
      : undefined;

  if (!file) {
    const response = {
      statusCode: 400,
      body: JSON.stringify({
        message: `Missing x-amz-meta-producer-key header`,
      }),
    };

    callback(null, response);
  }

  // If producer has correctly submitted a key.
  const params = {
    Bucket: bucket,
    Key: file,
    Expires: 30,
  };

  s3.getSignedUrl('putObject', params, (err, url) => {
    if (err) {
      callback(err);
    }

    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify(url),
    };

    callback(null, response);
  });
};

export const onProjectsGetRoot = (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support
      'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
    },
    body: JSON.stringify({
      message:
        'Docroot is not used at the moment. Please check the other endpoints',
    }),
  };

  callback(null, response);
};
