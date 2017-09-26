import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

const s3 = new AWS.S3({ signatureVersion: 'v4' });

/* eslint-disable import/prefer-default-export, no-console */
export const handler = (event, context, callback) => {
  const params = {
    Bucket: 'eubfr-dev',
    Fields: {
      foo: 'bar',
    },
  };

  s3.createPresignedPost(params, (err, data) => {
    if (err) {
      console.error('Presigning post data encountered an error', err);
    }

    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify(data),
    };

    callback(null, response);
  });
};
