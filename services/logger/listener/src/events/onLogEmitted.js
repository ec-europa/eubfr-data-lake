import elasticsearch from 'elasticsearch';
import connectionClass from 'http-aws-es';

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
  try {
    const snsMessage = JSON.parse(snsRecord.Sns.Message);

    // elasticsearch client configuration
    const options = {
      host: `https://${API}`,
      apiVersion: '6.0',
      connectionClass,
      index: INDEX,
    };

    // elasticsearch client instantiation
    const client = elasticsearch.Client(options);

    return client.index(
      {
        index: INDEX,
        type: snsMessage.type,
        body: {
          emitter: snsMessage.emitter,
          level: snsMessage.level,
          time: snsMessage.time,
          message: snsMessage.message,
        },
      },
      err => {
        if (err) return callback(err);
        return callback(null, 'ok');
      }
    );
  } catch (e) {
    return callback(e.message);
  }
};

export default handler;
