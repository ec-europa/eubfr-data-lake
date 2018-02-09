class Logger {
  constructor({ sns, targetArn, emitter }) {
    this.sns = sns;
    this.targetArn = targetArn;
    this.emitter = emitter;
  }

  log({ level = 'info', type = 'file', message = '' }) {
    return this.sns
      .publish({
        Message: JSON.stringify({
          default: JSON.stringify({
            emitter: this.emitter,
            level,
            type,
            time: new Date().toISOString(),
            message,
          }),
        }),
        MessageStructure: 'json',
        TargetArn: this.targetArn,
      })
      .promise();
  }

  info({ type = 'file', message = '' }) {
    return this.log({
      level: 'info',
      type,
      message,
    });
  }

  success({ type = 'file', message = '' }) {
    return this.log({
      level: 'success',
      type,
      message,
    });
  }

  error({ type = 'file', message = '' }) {
    return this.log({
      level: 'error',
      type,
      message,
    });
  }
}

export default Logger;
