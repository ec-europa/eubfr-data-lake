import stream from 'stream';
import crypto from 'crypto';
import uuid from 'uuid';

const type = `project`;

export default class SaveStream extends stream.Writable {
  constructor(options) {
    super(options);
    this.client = options.client;
    this.index = options.index;
    // Instance of this class is to target a fixed shard
    // https://docs.aws.amazon.com/kinesis/latest/APIReference/API_PutRecord.html?shortFooter=true#Streams-PutRecord-request-PartitionKey
    this.partitionKey = uuid.v1();
    this.stream = options.kinesisStream;
  }

  _write(chunk, enc, next) {
    // Manually calculate the ID
    // md5 hash of computed_key + project_id
    const { computed_key: computedKey, project_id: projectId } = chunk;

    const id = crypto
      .createHash('md5')
      .update(`${computedKey}/${projectId}`)
      .digest('hex');

    const record = Object.assign({}, chunk, { id, type, index: this.index });

    const params = {
      Data: JSON.stringify(record),
      PartitionKey: this.partitionKey,
      StreamName: this.stream,
    };

    // Kinesis client
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kinesis.html
    return this.client.putRecord(params, next);
  }
}
