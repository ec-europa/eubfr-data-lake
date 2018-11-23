const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');

const shell = promisify(exec);
const config = require('../../../../config.json');

// Protect certain stages from deletion.
if (['test', 'acc', 'prod'].includes(config.stage)) {
  console.log(`You are on protected stage ${config.stage}`);
  process.exit();
}

// Utilities
const getServices = require('../../lib/getServices');
const getServiceLocation = require('../../lib/getServiceLocation');

const deleteServices = async ({ services }) => {
  const list = getServices(services);

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
