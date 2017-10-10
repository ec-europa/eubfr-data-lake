import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import { checkAccess } from '../lib/checkAccess';

export const handler = (event, context, callback) => {
  checkAccess(event.requestContext.identity.userArn).then(accessGranted => {
    if (!accessGranted) {
      callback(null, {
        statusCode: 403,
        body: JSON.stringify({
          message:
            'Access denied. You have to be a member of the "Producers" group.',
        }),
      });
    }

    const bucket = process.env.BUCKET;
    const region = process.env.REGION;

    if (!bucket || !region) {
      callback(`BUCKET and REGION environment variable are required.`);
    }

    const s3 = new AWS.S3({ signatureVersion: 'v4', region });

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
  });
};

export default handler;
