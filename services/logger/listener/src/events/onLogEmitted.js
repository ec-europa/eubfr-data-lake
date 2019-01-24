import elasticsearch from 'elasticsearch';
import connectionClass from 'http-aws-es';

export const handler = async event => {
  const { API, INDEX } = process.env;

  try {
    /**
     * Validate input.
     */
    if (!event.Records) {
      throw new Error('No record');
    }

    // Only work on the first record.
    const snsRecord = event.Records[0];

    // Was the lambda triggered correctly? Is the file extension supported? etc.
    if (!snsRecord || snsRecord.EventSource !== 'aws:sns') {
      throw new Error('Bad record');
    }

    /**
     * Extract information from the event.
     */

    const snsMessage = JSON.parse(snsRecord.Sns.Message);

    // elasticsearch client configuration
    const options = {
      host: `https://${API}`,
      apiVersion: '6.3',
      connectionClass,
      index: INDEX,
    };

    // elasticsearch client instantiation
    const client = elasticsearch.Client(options);

    await client.index({
      index: INDEX,
      type: snsMessage.type,
      body: {
        emitter: snsMessage.emitter,
        level: snsMessage.level,
        time: snsMessage.time,
        message: snsMessage.message,
      },
    });
  } catch (e) {
    throw e;
  }
};

export default handler;
