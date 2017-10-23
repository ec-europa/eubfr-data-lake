import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import { checkAccess } from '../lib/checkAccess';
import { extractUsername } from '../lib/extractUsername';

export const handler = (event, context, callback) => {
  const { userArn } = event.requestContext.identity;
  const username = extractUsername(userArn);

  console.log(event);
  console.log(context);

  checkAccess(username).then(accessGranted => {
    if (!accessGranted) {
      return callback(null, {
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
      return callback(`BUCKET and REGION environment variable are required.`);
    }

    const s3 = new AWS.S3({ signatureVersion: 'v4', region });

    const file =
      event.headers && event.headers['x-amz-meta-computed-key']
        ? event.headers['x-amz-meta-computed-key']
        : undefined;

    if (!file) {
      const response = {
        statusCode: 400,
        body: JSON.stringify({
          message: `Missing x-amz-meta-computed-key header`,
        }),
      };

      return callback(null, response);
    }

    // If producer has correctly submitted a key.
    const params = {
      Bucket: bucket,
      Key: file,
      Expires: 300,
    };

    // TODO: call headObject to check if the object exists and if the user has the rights to access it

    return s3.getSignedUrl('getObject', params, (err, url) => {
      if (err) {
        return callback(err);
      }

      const response = {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
          'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
        },
        body: JSON.stringify(url),
      };

      return callback(null, response);
    });
  });
};

export default handler;
