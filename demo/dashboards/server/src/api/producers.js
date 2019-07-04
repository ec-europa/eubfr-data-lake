import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

export const handler = async () => {
  const { EUBFR_STAGE: stage } = process.env;
  const s3 = new AWS.S3();

  try {
    const results = await s3.listBuckets().promise();
    const buckets = results.Buckets;

    const dashboards = buckets.filter(bucket =>
      bucket.Name.includes(`eubfr-${stage}-demo-dashboard-client-`)
    );

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support
        'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify({ data: { dashboards } }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error }),
    };
  }
};

export default handler;
