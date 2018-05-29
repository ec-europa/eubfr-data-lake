import stream from 'stream';
import crypto from 'crypto';
import uuid from 'uuid';

export default class SaveStream extends stream.Writable {
  constructor(options) {
    super(options);
    this.client = options.client;
    this.stream = options.kinesisStream;
  }

  _write(batch, _, next) {
    // Batch per shard
    const batchKey = uuid.v1();

    const records = batch.map(chunk => {
      // Manually calculate the ID
      // md5 hash of computed_key + project_id
      const { computed_key: computedKey, project_id: projectId } = chunk;

      const id = crypto
        .createHash('md5')
        .update(`${computedKey}/${projectId}`)
        .digest('hex');

      const record = Object.assign({}, chunk, { id });

      return {
        Data: JSON.stringify(record),
        PartitionKey: batchKey,
      };
    });

    const params = {
      Records: records,
      StreamName: this.stream,
    };

    // Kinesis client
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kinesis.html
    return this.client.putRecords(params, next);

    // Promise in order to access feedback messages from the service
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Request.html
  }
}
