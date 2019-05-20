import elasticsearch from 'elasticsearch';
import connectionClass from 'http-aws-es';

export const handler = async event => {
  const { API, INDEX } = process.env;

  if (!API || !INDEX) {
    throw new Error('API and INDEX environment variables are required!');
  }

  try {
    /**
     * Validate input.
     */
    if (!event.Records) {
      throw new Error('No record');
    }

    const client = elasticsearch.Client({
      host: `https://${API}`,
      apiVersion: '6.5',
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

    await client.bulk({ body });

    return 'record updated successfully';
  } catch (e) {
    throw e;
  }
};

export default handler;
