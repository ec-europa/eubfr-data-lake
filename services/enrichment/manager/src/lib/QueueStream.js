import stream from 'stream';
import crypto from 'crypto';

const type = `project`;

export default class QueueStream extends stream.Writable {
  constructor(options) {
    super(options);
    this.client = options.client; // TO BE REMOVED
    this.index = options.index; // TO BE REMOVED
  }

  _write(chunk, enc, next) {
    // Manually calculate the ID
    // md5 hash of computed_key + project_id
    const { computed_key: computedKey, project_id: projectId } = chunk;
    const id = crypto
      .createHash('md5')
      .update(`${computedKey}/${projectId}`)
      .digest('hex');

    // PUSH TO SQS HERE
    return this.client.index(
      // TO BE REMOVED
      {
        index: this.index,
        type,
        id,
        body: chunk,
      },
      next
    );
  }
}
