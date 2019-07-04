// Utilities
const deleteServerlessService = require('../../lib/deleteServerlessService');

const dashboardDeleteCommand = async () => {
  try {
    // Delete website, S3 bucket needs to be empty before deleting the bucket itself.
    await deleteServerlessService('demo-dashboards-client', { isClient: true });

    // Delete client-side.
    await deleteServerlessService('demo-dashboards-client', {});

    // Delete server-side.
    await deleteServerlessService('demo-dashboards-server', {});

    return console.log('Dashboard: all deleted.');
  } catch (error) {
    return console.error(error);
  }
};

module.exports = dashboardDeleteCommand;
