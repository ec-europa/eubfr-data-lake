import stream from 'stream';

const type = `project`;

export default class SaveStream extends stream.Writable {
  constructor(options) {
    super(options);
    this.client = options.client;
    this.index = options.index;
  }

  _write(chunk, enc, next) {
    // Manually calculate the ID
    // computed_key + project_id
    const { computed_key: computedKey, project_id: projectId } = chunk;
    const id = `${computedKey}/${projectId}`;
    return this.client.index(
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
