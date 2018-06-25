const fs = require('fs');
const path = require('path');

const resolveSymbolicLink = require('../../../lib/resolveSymbolicLink');

module.exports = service =>
  resolveSymbolicLink(`node_modules/@eubfr/${service}`);
