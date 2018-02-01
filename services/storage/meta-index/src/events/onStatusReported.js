import elasticsearch from 'elasticsearch';
import connectionClass from 'http-aws-es';

export const handler = async (event, context, callback) => {
  const { API, INDEX } = process.env;

  /*
   * Some checks here before going any further
   */

  if (!event.Records) {
    return callback(new Error('No record'));
  }

  // Only work on the first record
  const snsRecord = event.Records ? event.Records[0] : undefined;

  // Was the lambda triggered correctly? Is the file extension supported? etc.
  if (
    !snsRecord ||
    !snsRecord.EventSubscriptionArn ||
    snsRecord.EventSource !== 'aws:sns'
  ) {
    return callback(new Error('Bad record'));
  }

  try {
    /*
     * Extract information from the event
     */

    // Extract S3 record
    const snsMessage = JSON.parse(snsRecord.Sns.Message);

    // eslint-disable-next-line
    const { computed_key, status_code, status_message } = snsMessage.message;

    // Update record
    const client = elasticsearch.Client({
      host: `https://${API}`,
      apiVersion: '6.0',
      connectionClass,
      index: INDEX,
    });

    await client.updateByQuery({
      index: INDEX,
      type: 'file',
      conflicts: 'proceed',
      body: {
        query: {
          term: {
            computed_key,
          },
        },
        script: {
          source:
            'ctx._source.message = params.message ; ctx._source.status = params.status',
          lang: 'painless',
          params: {
            message: status_message,
            status: status_code,
          },
        },
      },
    });

    return callback(null, 'All fine');
  } catch (err) {
    return callback(err);
  }
};

export default handler;
