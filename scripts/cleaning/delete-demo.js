#!/usr/bin/env node

require(`./utils/protectStage`)();

// Dependencies
const deleteServerlessService = require('../utils/deleteServerlessService');

const config = require('../config'); // eslint-disable-line import/no-unresolved

let usernames = Object.keys(config.demo);

if (process.env.EUBFR_USERNAME) {
  usernames = usernames.filter(
    username => username === process.env.EUBFR_USERNAME
  );
}

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

const deleteWebsite = async () => {
  await deleteServerlessService('demo-website', { isClient: true });
  await deleteServerlessService('demo-website', {});
};

const deleteDemo = async () =>
  Promise.all([
    ...usernames.map(async username =>
      Promise.all([deleteClient(username), deleteServer(username)])
    ),
    deleteWebsite(),
  ]);

// Start
deleteDemo();
