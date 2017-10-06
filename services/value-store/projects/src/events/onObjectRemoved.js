import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import deleteProjects from '../lib/deleteProjects';

export const handler = (event, context, callback) => {
  /*
   * Some checks here before going any further
   */

  if (!event.Records) {
    return callback('No record');
  }

  // Only work on the first record
  const snsRecord = event.Records[0];

  // Was the lambda triggered correctly? Is the file extension supported? etc.
  if (!snsRecord || snsRecord.EventSource !== 'aws:sns') {
    return callback('Bad record');
  }

  /*
   * Extract information from the event
   */

  // Extract S3 record
  const s3record = JSON.parse(snsRecord.Sns.Message).Records[0];

  /*
   * Get all records related to the S3 object
   */
  const documentClient = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10',
    convertEmptyValues: true,
  });

  const { TABLE } = process.env;

  /*
   * Delete existing records
   */
  return deleteProjects({
    documentClient,
    table: TABLE,
    key: s3record.s3.object.key,
  });
};

export default handler;
