const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');

const shell = promisify(exec);

// Utilities
const getConfigurations = require('../../lib/getConfigurations');
const getServiceLocation = require('../../lib/getServiceLocation');

const deleteResources = async () => {
  const slsBin = path.resolve(
    require.resolve('serverless'),
    '../../bin/serverless'
  );
  const resources = ['resources-raw-storage', 'resources-harmonized-storage'];
  const { stage, region } = getConfigurations();

  const operations = resources.map(async resource => {
    const cwd = path.resolve(`${getServiceLocation(resource)}`);

    try {
      console.log(`Deleting ${resource} ...`);
      console.time(resource);
      await shell(`${slsBin} remove --stage ${stage} --region ${region}`, {
        cwd,
      });
      console.log(`${resource} has been deleted.`);
      return console.timeEnd(resource);
    } catch (e) {
      return console.error(e);
    }
  });

  return Promise.all(operations);
};

module.exports = deleteResources;
