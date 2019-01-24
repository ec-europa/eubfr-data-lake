import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

export const handler = async event => {
  const { BUCKET } = process.env;

  if (!BUCKET) {
    throw new Error('BUCKET environment variable is required');
  }

  try {
    /**
     * Validate input.
     */

    // Only work on the first record
    const snsRecord = event.Records ? event.Records[0] : undefined;

    // Was the lambda triggered correctly? Is the file extension supported? etc.
    if (!snsRecord || snsRecord.EventSource !== 'aws:sns') {
      throw new Error('Bad record');
    }

    /**
     * Extract information from the event.
     */
    const message =
      snsRecord.Sns && snsRecord.Sns.Message
        ? snsRecord.Sns.Message
        : undefined;

    if (!message) {
      throw new Error('Missing message body');
    }

    // Extract S3 record
    const s3record = JSON.parse(message).Records[0];

    const s3 = new AWS.S3();

    const params = { Bucket: BUCKET, Key: `${s3record.s3.object.key}.ndjson` };

    await s3.deleteObject(params).promise();

    return 'object removed';
  } catch (e) {
    throw e;
  }
};

export default handler;
