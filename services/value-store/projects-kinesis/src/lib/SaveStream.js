import stream from 'stream';
import crypto from 'crypto';

const type = `project`;

export default class SaveStream extends stream.Writable {
  constructor(options) {
    super(options);
    this.client = options.client;
    this.index = options.index;
    this.deliveryStreamName = options.streamName;
  }

  _write(chunk, enc, next) {
    const { computed_key: computedKey, project_id: projectId } = chunk;

    const id = crypto
      .createHash('md5')
      .update(`${computedKey}/${projectId}`)
      .digest('hex');

    const record = { index: this.index, type, id, body: chunk };

    const params = {
      DeliveryStreamName: this.deliveryStreamName,
      Record: {
        Data: new Buffer(record),
      },
    };

    return this.client.putRecord(params, next);
  }
}
