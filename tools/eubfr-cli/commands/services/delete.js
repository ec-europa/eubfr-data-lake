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
