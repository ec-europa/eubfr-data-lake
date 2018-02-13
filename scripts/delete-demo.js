#!/usr/bin/env node

require(`./utils/protectStage`)();

// Dependencies
const deleteServerlessService = require('./utils/deleteServerlessService');

const config = require('../config'); // eslint-disable-line import/no-unresolved

let usernames = Object.keys(config.demo);

if (process.env.EUBFR_USERNAME) {
  usernames = usernames.filter(
    username => username === process.env.EUBFR_USERNAME
  );
}

// Remove dashboards
usernames.forEach(async username => {
  // Delete S3 buckets holding static assets (the React apps)
  await deleteServerlessService('demo-dashboard-client', {
    isClient: true,
    username,
  });
  // Delete also the CloudFormation stacks created by SLS
  await deleteServerlessService('demo-dashboard-client', { username });
  // Lastly, delete their back-ends
  await deleteServerlessService('demo-dashboard-server', { username });
});

// Remove the webiste
(async function removeWebsite() {
  await deleteServerlessService('demo-website', { isClient: true });
  await deleteServerlessService('demo-website', {});
})();
