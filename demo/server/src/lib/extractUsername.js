export const extractUsername = userArn =>
  userArn ? userArn.split(':')[5].replace('user/', '') : '';

export default extractUsername;
