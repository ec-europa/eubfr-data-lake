const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get config
const config = require(`../../config.json`);

// Helpers
const resolveSymbolicLink = filePath => {
  const lstat = fs.lstatSync(filePath);
  return lstat.isSymbolicLink()
    ? path.resolve(path.dirname(filePath), fs.readlinkSync(filePath))
    : false;
};

module.exports = service => {
  console.log(`Start deletion of ${service}`);
  console.time(service);

  const operation = spawn(
    `./node_modules/.bin/sls`,
    ['remove', `--stage ${config.stage}`, `--region ${config.region}`],
    {
      cwd: resolveSymbolicLink(`node_modules/@eubfr/${service}`),
      // This is a helper for serverless.yml variables as an alternative to options
      env: {
        EUBFR_USERNAME: process.env.EUBFR_USERNAME
          ? process.env.EUBFR_USERNAME
          : '',
      },
    }
  );

  operation.stdout.on('data', data => {
    console.log('\x1b[36m', `${data}`, '\x1b[0m');
  });

  operation.stderr.on('data', data => {
    console.log('\x1b[31m', `${data}`, '\x1b[31m');
  });

  operation.on('close', () => console.timeEnd(service));
};
