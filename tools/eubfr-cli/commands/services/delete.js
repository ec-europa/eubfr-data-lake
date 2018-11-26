const config = require('../../../../config.json'); // eslint-disable-line import/no-unresolved

// Protect certain stages from deletion.
if (['test', 'acc', 'prod'].includes(config.stage)) {
  console.log(`You are on protected stage ${config.stage}`);
  process.exit();
}

// Utilities
const getServices = require('../../lib/getServices');
const deleteServerlessService = require('../../lib/deleteServerlessService');

const deleteServices = async ({ services }) => {
  const list = getServices(services);

  const operations = list.map(async service => {
    await deleteServerlessService(service.service, {});
  });

  return Promise.all(operations);
};

module.exports = deleteServices;
