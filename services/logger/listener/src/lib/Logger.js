function Logger({ sns, targetArn, emitter }) {
  this.sns = sns;
  this.targetArn = targetArn;
  this.emitter = emitter;
}

Logger.prototype.info = function info({ type = 'file', message = '' }) {
  return this.sns
    .publish({
      Message: JSON.stringify({
        default: JSON.stringify({
          emitter: this.emitter,
          level: 'info',
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

export default Logger;
