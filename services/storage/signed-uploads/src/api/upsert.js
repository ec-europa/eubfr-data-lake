import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import path from 'path';
import uuid from 'uuid/v4';
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

    // Extract env vars
    const { BUCKET, REGION } = process.env;

    if (!BUCKET || !REGION) {
      return callback(`BUCKET and REGION environment variable are required.`);
    }

    const s3 = new AWS.S3({ signatureVersion: 'v4', REGION });

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

    const extension = path.extname(file);

    // If producer has correctly submitted a key.
    const params = {
      ACL: 'public-read',
      Bucket: BUCKET,
      Key: `${username}/${uuid()}${extension}`,
      Expires: 300,
      Metadata: {
        producer: userArn,
        'original-key': file,
      },
    };

    return s3.getSignedUrl('putObject', params, (err, url) => {
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
