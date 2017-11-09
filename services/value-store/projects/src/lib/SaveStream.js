import stream from 'stream';

export default class SaveStream extends stream.Writable {
  constructor(options) {
    super(options);
    this.client = options.client;
    this.index = options.index;
  }

  _write(chunk, enc, next) {
    return this.client.index(
      {
        index: this.index,
        type: 'project',
        body: chunk,
      },
      next
    );
  }
}
