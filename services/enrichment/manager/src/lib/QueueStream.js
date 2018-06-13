import stream from 'stream';

export default class QueueStream extends stream.Writable {
  constructor(options) {
    super(options);
    this.sns = options.sns;
    this.snsEndpoint = options.snsEndpoint;
  }

  _write(chunk, enc, next) {
    return this.sns.publish(
      {
        Message: JSON.stringify({
          default: JSON.stringify(chunk),
        }),
        MessageStructure: 'json',
        TargetArn: this.snsEndpoint,
      },
      err => {
        if (err) {
          console.log('Error', err, chunk);
        }

        next();
      }
    );
  }
}
