import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import ES from 'elasticsearch';
import AwsEsHttp from 'http-aws-es';

export const handler = (event, context, callback) => {
  const { HOST } = process.env;

  /*
   * Some checks here before going any further
   */
  if (!HOST) {
    return callback(`Elasticsearch HOST env variable is required.`);
  }

  if (!event.Records) {
    return callback('No record');
  }

  // Only work on the first record
  const snsRecord = event.Records[0];

  // Was the lambda triggered correctly? Is the file extension supported? etc.
  if (!snsRecord || snsRecord.EventSource !== 'aws:sns') {
    return callback('Bad record');
  }

  // Extract S3 record
  const s3record = JSON.parse(snsRecord.Sns.Message).Records[0];

  // Instantiate S3 client.
  const s3 = new AWS.S3();

  // Instantiate ES client
  const es = ES.Client({
    hosts: [HOST],
    connectionClass: AwsEsHttp,
  });

  es.ping(
    {
      // ping usually has a 3000ms timeout
      requestTimeout: 1000,
    },
    error => {
      if (error) {
        console.trace('elasticsearch cluster is down!');
      } else {
        console.log('The elasticsearch cluster is ok.');
      }
    }
  );

  return s3
    .headObject({
      Bucket: s3record.s3.bucket.name,
      Key: s3record.s3.object.key,
    })
    .promise()
    .then(console.log)
    .catch(err => callback(err));
};

export default handler;
