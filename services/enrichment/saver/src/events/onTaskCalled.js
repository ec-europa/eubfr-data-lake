import elasticsearch from 'elasticsearch';
import connectionClass from 'http-aws-es';
import { computeId } from '../lib/computeId';

export const handler = async (event, context, callback) => {
  const record = JSON.parse(event.Body);

  const { API, INDEX } = process.env;

  // Elasticsearch client instantiation
  const client = elasticsearch.Client({
    host: `https://${API}`,
    apiVersion: '6.2',
    connectionClass,
    index: INDEX,
  });

  // Compute ID
  const id = computeId({
    computedKey: record.computed_key,
    projectId: record.project_id,
  });

  try {
    await client.index({
      index: INDEX,
      type: 'project',
      id,
      body: Object.assign({}, record, {
        last_modified: new Date().toISOString(), // ISO-8601 date
      }),
    });
  } catch (e) {
    return callback(e);
  }

  return callback(null, 'record saved successfully');
};

export default handler;
