import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import { checkAccess } from '../lib/checkAccess';
import { extractUsername } from '../lib/extractUsername';

export const handler = (event, context, callback) => {
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

    const bucket = process.env.BUCKET;
    const region = process.env.REGION;

    if (!bucket || !region) {
      return callback(`BUCKET and REGION environment variable are required.`);
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

      return callback(null, response);
    }

    if (!file.startsWith(username)) {
      const response = {
        statusCode: 400,
        body: JSON.stringify({
          error: `You can't update a file you don't own.`,
        }),
      };

      return callback(null, response);
    }

    return s3.headObject(
      {
        Bucket: bucket,
        Key: file,
      },
      (err, data) => {
        if (err) {
          const response = {
            statusCode: 400,
            body: JSON.stringify(err),
          };

          return callback(null, response);
        }

        // If producer has correctly submitted a key.
        const params = {
          ACL: 'public-read',
          Bucket: bucket,
          Key: file,
          Expires: 300,
          Metadata: data.Metadata,
        };

        return s3.getSignedUrl('putObject', params, (signedErr, url) => {
          if (signedErr) {
            return callback(signedErr);
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
      }
    );
  });
};

export default handler;
