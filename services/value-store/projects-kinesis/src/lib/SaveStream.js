import stream from 'stream';

export default class SaveStream extends stream.Writable {
  constructor(options) {
    super(options);
    this.client = options.client;
    this.deliveryStreamName = options.streamName;
  }

  _write(batch, _, next) {
    // Formatting structure to match expectation of firehose client.
    const records = batch.map(record => ({
      Data: JSON.stringify(record),
    }));

    const params = {
      DeliveryStreamName: this.deliveryStreamName,
      Records: records,
    };

    return this.client.putRecordBatch(params, next);
  }
}
