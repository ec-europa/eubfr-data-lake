const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');

const shell = promisify(exec);

// Get config
const config = require(`../../../../config.json`); // eslint-disable-line import/no-unresolved

// Utilities
const getAvailableServices = require('../../lib/getAvailableServices');
const getServiceLocation = require('../../lib/getServiceLocation');

const deleteServices = async ({ services }) => {
  const list = getAvailableServices(services);

  const operations = list.map(async service => {
    const serviceName = service.service;
    const cwd = path.resolve(`${getServiceLocation(serviceName)}`);
    try {
      console.log(`Deleting ${serviceName} ...`);
      console.time(serviceName);
      await shell(
        `npx sls remove --stage ${config.stage} --region ${config.region}`,
        { cwd }
      );
      console.log(`${serviceName} has been deleted.`);
      return console.timeEnd(serviceName);
    } catch (e) {
      return console.error(e);
    }
  });

  return Promise.all(operations);
};

module.exports = deleteServices;
