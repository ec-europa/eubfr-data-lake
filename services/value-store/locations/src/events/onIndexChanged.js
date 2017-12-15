import getIndexOperation from '../lib/getIndexOperation';
import createLocations from '../lib/createLocations';
import deleteLocations from '../lib/deleteLocations';

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

  // Extract S3 record
  const s3record = JSON.parse(snsRecord.Sns.Message).Records[0];

  const op = getIndexOperation(s3record);

  switch (op) {
    case 'CREATE':
      return createLocations({ API, INDEX }, s3record);

    case 'DELETE':
      return deleteLocations({ API, INDEX }, s3record);

    default:
      return callback();
  }
};

export default handler;
