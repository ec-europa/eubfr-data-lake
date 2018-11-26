const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');

const shell = promisify(exec);

const getServiceLocation = require('../../lib/getServiceLocation');

const deployResources = async () => {
  const resources = [
    'resources-raw-storage',
    'resources-harmonized-storage',
    'resources-elasticsearch',
  ];

  await Promise.all(
    resources.map(async resource => {
      const cwd = path.resolve(`${getServiceLocation(resource)}`);

      try {
        console.log(`Deploying ${resource}`);
        console.time(resource);
        await shell('npx sls deploy', { cwd });
        console.log(`${resource} has been deployed`);
        console.timeEnd(resource);
      } catch (e) {
        console.error(e);
      }
    })
  );
};

module.exports = deployResources;
