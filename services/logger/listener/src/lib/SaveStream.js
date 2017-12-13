import stream from 'stream';

const type = `log`;

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
        type,
        body: chunk,
      },
      next
    );
  }
}
