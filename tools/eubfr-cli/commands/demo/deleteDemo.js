const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');

const shell = promisify(exec);

// Get config
const config = require(`../../../../config.json`); // eslint-disable-line import/no-unresolved

// Protect certain stages from deletion.
if (['test', 'acc', 'prod'].includes(config.stage)) {
  console.log(`You are on protected stage ${config.stage}`);
  process.exit();
}

// Utilities
const getDemos = require('../../lib/getDemos');
const getServiceLocation = require('../../lib/getServiceLocation');
const getAllProducers = require('../../lib/getAllProducers');

const deleteServices = async ({ services }) => {
  const demos = getDemos();
  const demosToDelete = producer === '*' ? getAllProducers() : [producer];

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
