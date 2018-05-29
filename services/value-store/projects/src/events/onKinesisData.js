import elasticsearch from 'elasticsearch';
import connectionClass from 'http-aws-es';

export const handler = (event, context, callback) => {
  // body is to match bulk API https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference-2-4.html
  let body = '';
  const { API, INDEX } = process.env;

  if (!API || !INDEX) {
    return callback(
      new Error('API and INDEX environment variables are required!')
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

  // Kinesis data is base64 encoded so decode here
  const normalize = record =>
    Buffer.from(record.kinesis.data, 'base64').toString();

  event.Records.map(normalize).forEach(record => {
    const doc = JSON.parse(record);
    // action description
    const action = {
      index: { _index: INDEX, _type: 'project', _id: record.id },
    };
    body += `${JSON.stringify(action)}\n`;
    // the document to index
    body += `${JSON.stringify(doc)}\n`;
  });

  return client.bulk({ body });
};

export default handler;
