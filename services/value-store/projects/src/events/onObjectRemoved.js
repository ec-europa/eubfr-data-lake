import elasticsearch from 'elasticsearch';
import connectionClass from 'http-aws-es';

import deleteProjects from '../lib/deleteProjects';

export const handler = (event, context, callback) => {
  const { API, INDEX } = process.env;

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

  // elasticsearch client configuration
  const options = {
    host: `https://${API}`,
    connectionClass,
    log: 'trace',
    index: INDEX,
  };

  // elasticsearch client instantiation
  const client = elasticsearch.Client(options);

  /*
   * Delete existing records
   */
  return deleteProjects({
    client,
    index: INDEX,
    key: s3record.s3.object.key,
  });
};

export default handler;
