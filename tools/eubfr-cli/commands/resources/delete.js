const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');

const shell = promisify(exec);

// Get config
const config = require(`../../../../config.json`); // eslint-disable-line import/no-unresolved

// Utilities
const getServiceLocation = require('../../lib/getServiceLocation');

const deleteResources = async () => {
  const resources = ['resources-raw-storage', 'resources-harmonized-storage'];

  const operations = resources.map(async resource => {
    const cwd = path.resolve(`${getServiceLocation(resource)}`);
    try {
      console.log(`Deleting ${resource} ...`);
      console.time(resource);
      await shell(
        `npx sls remove --stage ${config.stage} --region ${config.region}`,
        { cwd }
      );
      console.log(`${resource} has been deleted.`);
      return console.timeEnd(resource);
    } catch (e) {
      return console.error(e);
    }
  });

  return Promise.all(operations);
};

module.exports = deleteResources;
