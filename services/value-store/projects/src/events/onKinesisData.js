import elasticsearch from 'elasticsearch';
import connectionClass from 'http-aws-es';

export const handler = async (event, context, callback) => {
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

  console.log('Received event:', JSON.stringify(event, null, 2));

  return event.Records.forEach(record => {
    // Kinesis data is base64 encoded so decode here
    const payload = Buffer.from(record.kinesis.data, 'base64').toString();

    console.log('Decoded payload:', payload);

    // const id = crypto
    //   .createHash('md5')
    //   .update(`${computedKey}/${projectId}`)
    //   .digest('hex');
    //
    // client.index({ index: INDEX, type: 'project', id, body: payload });
  });
};

export default handler;
