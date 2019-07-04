// Utilities
const deleteServerlessService = require('../../lib/deleteServerlessService');

const dashboardDeleteCommand = async () => {
  const service = 'demo-dashboards';

  try {
    // Delete website, S3 bucket needs to be empty before deleting the bucket itself.
    await deleteServerlessService(service, { isClient: true });

    // Delete assets created by serverless.yml file.
    await deleteServerlessService(service, {});

    return console.log('Dashboard: all deleted.');
  } catch (error) {
    return console.error(error);
  }
};

module.exports = dashboardDeleteCommand;
