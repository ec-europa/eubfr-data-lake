function Logger({ sns, targetArn, emitter }) {
  this.sns = sns;
  this.targetArn = targetArn;
  this.emitter = emitter;
}

Logger.prototype.log = function log({
  level = 'info',
  type = 'file',
  message = '',
}) {
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
};

Logger.prototype.info = function info({ type = 'file', message = '' }) {
  return this.log({
    level: 'info',
    type,
    message,
  });
};

Logger.prototype.error = function info({ type = 'file', message = '' }) {
  return this.log({
    level: 'error',
    type,
    message,
  });
};

export default Logger;
