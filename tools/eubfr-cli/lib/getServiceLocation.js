const resolveSymbolicLink = require('../../../lib/resolveSymbolicLink');

module.exports = service =>
  resolveSymbolicLink(`node_modules/@eubfr/${service}`);
