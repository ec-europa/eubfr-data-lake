const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get config
const config = require(`../../config.json`); // eslint-disable-line import/no-unresolved

// Helpers
const resolveSymbolicLink = filePath => {
  const lstat = fs.lstatSync(filePath);
  return lstat.isSymbolicLink()
    ? path.resolve(path.dirname(filePath), fs.readlinkSync(filePath))
    : false;
};

module.exports = (service, { isClient = false, username = '' }) =>
  new Promise((resolve, reject) => {
    const serviceName = `${service}${username ? `-${username}` : ''}`;
    console.log(`Start deletion of ${serviceName}`);
    console.time(serviceName);

    let operation;

    if (username) {
      process.env.EUBFR_USERNAME = username;
    }

    if (isClient) {
      operation = spawn('./node_modules/.bin/sls', ['client', 'remove'], {
        cwd: resolveSymbolicLink(`node_modules/@eubfr/${service}`),
        env: process.env,
      });
    } else {
      operation = spawn(
        './node_modules/.bin/sls',
        ['remove', `--stage ${config.stage}`, `--region ${config.region}`],
        {
          cwd: resolveSymbolicLink(`node_modules/@eubfr/${service}`),
          env: process.env,
        }
      );
    }

    operation.stdout.on('data', data => {
      console.log('\x1b[36m', `${data}`, '\x1b[0m');
    });

    operation.stderr.on('data', err => {
      reject(err.toString());
      console.error('\x1b[31m', `${err}`, '\x1b[31m');
    });

    operation.on('close', () => {
      console.timeEnd(serviceName);
    });

    operation.on('exit', resolve);
  });
