import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import { checkAccess } from '../lib/checkAccess';
import { extractUsername } from '../lib/extractUsername';

export const handler = (event, context, callback) => {
  // Extract env vars
  const { BUCKET, REGION } = process.env;

  if (!BUCKET || !REGION) {
    return callback(
      new Error('BUCKET and REGION environment variables are required!')
    );
  }

  const { userArn } = event.requestContext.identity;
  const username = extractUsername(userArn);

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

    const s3 = new AWS.S3({ signatureVersion: 'v4', REGION });

    const file =
      event.headers && event.headers['x-amz-meta-computed-key']
        ? event.headers['x-amz-meta-computed-key']
        : undefined;

    if (!file) {
      const response = {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing x-amz-meta-computed-key header',
        }),
      };

      return callback(null, response);
    }

    if (!file.startsWith(username)) {
      const response = {
        statusCode: 400,
        body: JSON.stringify({
          error: "You can't delete a file you don't own.",
        }),
      };

      return callback(null, response);
    }

    // If producer has correctly submitted a key.
    const params = {
      Bucket: BUCKET,
      Key: file,
    };

    return s3.deleteObject(params, err => {
      if (err) {
        const response = {
          statusCode: 400,
          body: JSON.stringify({
            error: 'An error occured',
            err,
          }),
        };

        return callback(null, response);
      }

      const response = {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
          'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
        },
        body: JSON.stringify({
          message: 'Object deleted successfully',
        }),
      };

      return callback(null, response);
    });
  });
};

export default handler;
