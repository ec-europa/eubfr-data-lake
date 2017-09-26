import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

const s3 = new AWS.S3({
  signatureVersion: 'v4',
  region: 'eu-central-1',
});

/* eslint-disable import/prefer-default-export, no-console */
export const handler = (event, context, callback) => {
  const file = event.headers.key;

  const params = {
    Bucket: 'eubfr-dev',
    Key: file,
    Expires: 30,
  };

  s3.getSignedUrl('putObject', params, (err, url) => {
    if (err) {
      callback(err, 'Error creating a signed upload.');
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
