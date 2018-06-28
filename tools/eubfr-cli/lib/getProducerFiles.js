const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readDir = promisify(fs.readdir);

module.exports = async producer => {
  let files = [];
  // const dir = path.resolve(`.content/${producer}`);
  const dir = path.resolve(`.content/${producer}`);
  try {
    if (fs.existsSync(dir)) {
      const results = await readDir(dir);
      // Filter hidden/dot files
      files = results.filter(file => !/(^|\/)\.[^\/\.]/g.test(file)); // eslint-disable-line no-useless-escape
    }
  } catch (e) {
    return console.error(e);
  }
  return files;
};
