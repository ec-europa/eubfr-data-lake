const fs = require('fs');
const path = require('path');

module.exports = producer =>
  fs
    .readdirSync(path.resolve(`.content/${producer}`))
    .filter(file => !/^\..*/.test(file));
