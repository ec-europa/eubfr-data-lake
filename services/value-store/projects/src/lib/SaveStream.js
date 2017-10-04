import stream from 'stream';

export default class SaveStream extends stream.Writable {
  constructor(options) {
    super(options);
    this.documentClient = options.documentClient;
    this.table = options.table;
  }

  _write(chunk, enc, next) {
    const params = {
      TableName: this.table,
      Item: chunk,
    };

    return this.documentClient.put(params, next);
  }
}
