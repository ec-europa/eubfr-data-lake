const fs = require('fs');
const path = require('path');

module.exports = producer => {
  const dir = path.resolve(`.content/${producer}`);
  return fs.existsSync(dir)
    ? fs.readdirSync(dir).filter(file => !/^\..*/.test(file))
    : [];
};
