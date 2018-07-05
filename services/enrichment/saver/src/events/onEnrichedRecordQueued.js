import elasticsearch from 'elasticsearch';
import connectionClass from 'http-aws-es';

export const handler = async (event, context, callback) => {
  console.log(JSON.stringify(event));
  callback();

  const record = JSON.parse(event.Body);

  if (!record.id || !record.data) {
    return callback(null, 'no ID provided');
  }

  const { API, INDEX } = process.env;

  // Elasticsearch client instantiation
  const client = elasticsearch.Client({
    host: `https://${API}`,
    apiVersion: '6.2',
    connectionClass,
    index: INDEX,
  });

  // Compute ID
  const { id } = record;

  const body = Object.assign({}, record.data, {
    last_modified: new Date().toISOString(), // ISO-8601 date
  });

  try {
    await client.update({
      index: INDEX,
      type: 'project',
      id,
      body: {
        doc: body,
      },
    });

    return callback(null, 'record updated successfully');
  } catch (e) {
    return callback(e);
  }
};

export default handler;
