import elasticsearch from 'elasticsearch';
import connectionClass from 'http-aws-es';

export const handler = async (event, context, callback) => {
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
    return callback('No record');
  }

  // Elasticsearch client instantiation
  const client = elasticsearch.Client({
    host: `https://${API}`,
    apiVersion: '6.2',
    connectionClass,
    index: INDEX,
  });

  let body = '';

  event.Records.map(record => JSON.parse(record.body)).forEach(record => {
    // Compute ID
    const { id } = record;

    const action = {
      update: { _index: INDEX, _type: 'project', _id: id },
    };

    const doc = {
      doc: Object.assign({}, record.data, {
        last_modified: new Date().toISOString(), // ISO-8601 date
      }),
    };

    body += `${JSON.stringify(action)}\n`;
    // the document to index
    body += `${JSON.stringify(doc)}\n`;
  });

  try {
    await client.bulk({ body });

    return callback(null, 'record updated successfully');
  } catch (e) {
    return callback(e);
  }
};

export default handler;
