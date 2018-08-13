const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');

const shell = promisify(exec);
const getServiceLocation = require('../../lib/getServiceLocation');

const generateEnvironmentVariables = () => {
  // The CLI needs these for various environment variables.
  const services = [
    'storage-deleter',
    'storage-signed-uploads',
    'demo-dashboard-client',
  ];

  const operations = services.map(async service => {
    // Temporarily set a username for services which require it.
    // For the moment, this doesn't matter.
    process.env.EUBFR_USERNAME = 'agri';

    console.time(service);
    const cwd = path.resolve(`${getServiceLocation(service)}`);
    // First make sure latest code has been deployed correctly.
    await shell('npx sls deploy', { cwd });
    // Export the necessary environment variables.
    await shell('npx sls export-env', { cwd });
    console.timeEnd(service);

    delete process.env.EUBFR_USERNAME;
  });

  Promise.all(operations);
};

module.exports = generateEnvironmentVariables;
