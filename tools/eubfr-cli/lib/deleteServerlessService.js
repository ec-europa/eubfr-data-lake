const { spawn } = require('child_process');

// Get config
const config = require('../../../config.json'); // eslint-disable-line import/no-unresolved

// Helpers
const getServiceLocation = require('../lib/getServiceLocation');

module.exports = (service, { isClient = false, username = '' }) =>
  new Promise((resolve, reject) => {
    const serviceName = `${service}${username ? `-${username}` : ''}${
      isClient ? ' (client)' : ''
    }`;
    console.log(`Start deletion of ${serviceName}`);
    console.time(serviceName);

    let operation;

    if (username) {
      process.env.EUBFR_USERNAME = username;
    }

    if (isClient) {
      operation = spawn(
        './node_modules/.bin/sls',
        ['client', 'remove', '--no-confirm'],
        {
          cwd: getServiceLocation(service),
          env: process.env,
        }
      );
    } else {
      operation = spawn(
        './node_modules/.bin/sls',
        ['remove', `--stage ${config.stage}`, `--region ${config.region}`],
        {
          cwd: getServiceLocation(service),
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
