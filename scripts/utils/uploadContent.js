const fs = require('fs');
const shell = require('shelljs'); // eslint-disable-line import/no-extraneous-dependencies

module.exports = producer => {
  const cwd = `.content/${producer}/`;
  // Prepare list of producer's files.
  const files = fs
    .readdirSync(cwd)
    .map(file => cwd + file)
    .join(' ');

  console.log(`Start content upload for ${producer} ...`);

  shell.exec(`npx eubfr-cli upload ${files} --producer ${producer}`);
};
