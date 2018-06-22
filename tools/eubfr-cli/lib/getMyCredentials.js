// Tiny wrapper around the topic of getting AWS credentials.
// Could be done in many other ways, that's why it's separate.
//
const awscred = require('awscred');
const { promisify } = require('util');

module.exports = promisify(awscred.loadCredentials);
