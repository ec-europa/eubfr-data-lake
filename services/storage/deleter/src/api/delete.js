import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import { getUserGroups } from '../lib/getUserGroups';
import { extractUsername } from '../lib/extractUsername';

export const handler = async event => {
  const { BUCKET, REGION } = process.env;

  if (!BUCKET || !REGION) {
    throw new Error('BUCKET and REGION environment variables are required!');
  }

  try {
    const { userArn } = event.requestContext.identity;
    const username = extractUsername(userArn);

    const groups = await getUserGroups(username);

    const accessGranted = groups.Groups.some(
      group => group.GroupName === 'Producers'
    );

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

    await s3.deleteObject({ Bucket: BUCKET, Key: file }).promise();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work.
        'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS.
      },
      body: JSON.stringify({ message: 'Object deleted successfully.' }),
    };
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify(e) };
  }
};

export default handler;
