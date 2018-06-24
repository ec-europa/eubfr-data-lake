// Useful when the user of the CLI is the actual producer
// and credentials don't come from config.json

const awscred = require('awscred');
const { promisify } = require('util');

module.exports = promisify(awscred.loadCredentials);
