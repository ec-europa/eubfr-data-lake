const getConfigurations = require('../../lib/getConfigurations');

const { stage } = getConfigurations();

// Protect certain stages from deletion.
if (['test', 'acc', 'prod'].includes(stage)) {
  console.log(`You are on protected stage ${stage}`);
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
