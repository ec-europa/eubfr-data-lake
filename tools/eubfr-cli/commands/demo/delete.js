const getConfigurations = require('../../lib/getConfigurations');

const { stage } = getConfigurations();

// Protect certain stages from deletion.
if (['test', 'acc', 'prod'].includes(stage)) {
  console.log(`You are on protected stage ${stage}`);
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
