const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');

const shell = promisify(exec);

// Utilities
const getServiceLocation = require('../../lib/getServiceLocation');

const deployResources = async () => {
  const resources = ['resources-raw-storage', 'resources-harmonized-storage'];

  // Using for-of on purpose for a sequential resolution of promises.
  // eslint-disable-next-line
  for (const resource of resources) {
    const cwd = path.resolve(`${getServiceLocation(resource)}`);

    try {
      console.log(`Deploying ${resource}`);
      console.time(resource);
      // Deploy the resource.
      // eslint-disable-next-line
      await shell('npx sls deploy', { cwd });
      console.log(`${resource} has been deployed`);
      console.timeEnd(resource);
    } catch (e) {
      console.error(e);
    }
  }
};

module.exports = deployResources;
