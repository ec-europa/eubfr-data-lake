import stream from 'stream';

export default class QueueStream extends stream.Writable {
  constructor(options) {
    super(options);
    this.sqs = options.sqs;
    this.queueUrl = options.queueUrl;
  }

  _write(chunk, enc, next) {
    return this.sqs.sendMessage(
      {
        MessageAttributes: {},
        MessageBody: JSON.stringify(chunk),
        QueueUrl: this.queueUrl,
      },
      err => {
        if (err) {
          console.log('Error', err);
        }

        next();
      }
    );
  }
}
