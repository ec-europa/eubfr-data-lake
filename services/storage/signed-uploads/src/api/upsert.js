import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import path from 'path';
import uuid from 'uuid/v4';
import { getUserGroups } from '../lib/getUserGroups';
import { extractUsername } from '../lib/extractUsername';

export const handler = async event => {
  const { BUCKET, REGION } = process.env;

  if (!BUCKET || !REGION) {
    throw new Error('BUCKET and REGION environment variables are required!');
  }

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
    event.headers && event.headers['x-amz-meta-producer-key']
      ? event.headers['x-amz-meta-producer-key']
      : undefined;

  if (!file) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: `Missing x-amz-meta-producer-key header`,
      }),
    };
  }

  const extension = path.extname(file);

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

  try {
    // The .promise() chained method is not necessary here.
    // @read https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getSignedUrl-property.
    const url = await s3.getSignedUrl('putObject', params);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(url),
    };
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify(err) };
  }
};

export default handler;
