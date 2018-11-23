// Get config
const config = require(`../../../../config.json`); // eslint-disable-line import/no-unresolved

// Protect certain stages from deletion.
if (['test', 'acc', 'prod'].includes(config.stage)) {
  console.log(`You are on protected stage ${config.stage}`);
  process.exit();
}

// Utilities
const getAllProducers = require('../../lib/getAllProducers');
const deleteServerlessService = require('../../lib/deleteServerlessService');

const deleteClient = async username => {
  // Delete S3 buckets holding static assets (the React apps)
  await deleteServerlessService('demo-dashboard-client', {
    isClient: true,
    username,
  });

  // Delete also the CloudFormation stacks created by SLS
  await deleteServerlessService('demo-dashboard-client', { username });
};

const deleteServer = async username =>
  deleteServerlessService('demo-dashboard-server', { username });

const deleteDemo = async ({ producer }) => {
  const usernames = producer === '*' ? getAllProducers() : [producer];

  const execute = async () =>
    Promise.all([
      ...usernames.map(async username =>
        Promise.all([deleteClient(username), deleteServer(username)])
      ),
    ]);

  // Start
  execute();
};

module.exports = deleteDemo;
