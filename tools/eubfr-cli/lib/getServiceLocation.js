const resolveSymbolicLink = require('@eubfr/lib/resolveSymbolicLink');

module.exports = service =>
  resolveSymbolicLink(`node_modules/@eubfr/${service}`);
