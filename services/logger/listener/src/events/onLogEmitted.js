// import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
// import elasticsearch from 'elasticsearch';
// import connectionClass from 'http-aws-es';

export const handler = (event, context, callback) => {
  // const { API, INDEX } = process.env;

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

  console.log(snsRecord);

  return callback(null, 'ok');
};

export default handler;
