import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import { checkAccess } from '../lib/checkAccess';
import { extractUsername } from '../lib/extractUsername';

export const handler = async event => {
  const { BUCKET, REGION } = process.env;

  if (!BUCKET || !REGION) {
    throw new Error('BUCKET and REGION environment variables are required!');
  }

  try {
    const { userArn } = event.requestContext.identity;
    const username = extractUsername(userArn);

    const accessGranted = await checkAccess(username);

    if (!accessGranted) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          message:
            'Access denied. You have to be a member of the "Producers" group.',
        }),
      };
    }

    const s3 = new AWS.S3({ signatureVersion: 'v4', REGION });

    const file =
      event.headers && event.headers['x-amz-meta-computed-key']
        ? event.headers['x-amz-meta-computed-key']
        : undefined;

    if (!file) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing x-amz-meta-computed-key header',
        }),
      };
    }

    if (!file.startsWith(username)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "You can't delete a file you don't own.",
        }),
      };
    }

    // If producer has correctly submitted a key.
    const params = { Bucket: BUCKET, Key: file };

    try {
      await s3.deleteObject(params).promise();

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(
          // Required for CORS support to work.
          // Required for cookies, authorization headers with HTTPS.
          { message: 'Object deleted successfully.' }
        ),
      };
    } catch (err) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'An error occured in s3.deleteObject method.',
          err,
        }),
      };
    }
  } catch (e) {
    throw e;
  }
};

export default handler;
