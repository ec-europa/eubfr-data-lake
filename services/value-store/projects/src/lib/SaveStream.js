import stream from 'stream';
import crypto from 'crypto';

export default class SaveStream extends stream.Writable {
  constructor(options) {
    super(options);
    this.client = options.client;
    this.index = options.index;
  }

  _write(batch, _, next) {
    let body = '';

    batch.forEach(chunk => {
      // Manually calculate the ID
      // md5 hash of computed_key + project_id
      const { computed_key: computedKey, project_id: projectId } = chunk;

      const id = crypto
        .createHash('md5')
        .update(`${computedKey}/${projectId}`)
        .digest('hex');

      const action = {
        index: { _index: this.index, _type: 'project', _id: id },
      };

      const doc = Object.assign({}, chunk, { id });

      body += `${JSON.stringify(action)}\n`;
      // the document to index
      body += `${JSON.stringify(doc)}\n`;
    });

    return this.client.bulk({ body }, next);
  }
}
