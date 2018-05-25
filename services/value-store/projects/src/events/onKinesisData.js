import elasticsearch from 'elasticsearch';
import connectionClass from 'http-aws-es';

export const handler = (event, context, callback) => {
  const { API, INDEX, REGION, STAGE } = process.env;

  if (!API || !INDEX || !REGION || !STAGE) {
    return callback(
      new Error(
        'API, INDEX, REGION and STAGE environment variables are required!'
      )
    );
  }

  /*
   * Some checks here before going any further
   */
  if (!event.Records) {
    return callback(new Error('No record'));
  }

  // Insantiate clients
  const client = elasticsearch.Client({
    host: `https://${API}`,
    apiVersion: '6.0',
    connectionClass,
    index: INDEX,
  });

  const indexRecord = async record => {
    // Kinesis data is base64 encoded so decode here
    const payload = Buffer.from(record.kinesis.data, 'base64').toString();

    await client.index({ index: INDEX, type: 'project', body: payload });
  };

  return event.Records.map(indexRecord);
};

export default handler;
