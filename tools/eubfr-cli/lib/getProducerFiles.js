const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readDir = promisify(fs.readdir);

module.exports = async producer => {
  try {
    const files = await readDir(path.resolve(`.content/${producer}`));
    // Filter hidden/dot files
    return files.filter(file => !/(^|\/)\.[^\/\.]/g.test(file)); // eslint-disable-line no-useless-escape
  } catch (e) {
    return console.error(e);
  }
};
