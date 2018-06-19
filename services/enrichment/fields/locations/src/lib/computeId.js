import crypto from 'crypto';

export const computeId = ({ computedKey, projectId }) =>
  crypto
    .createHash('md5')
    .update(`${computedKey}/${projectId}`)
    .digest('hex');

export default computeId;
