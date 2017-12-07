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
usernames.forEach(username => {
  deleteServerlessService('demo-dashboard-client', {
    isClient: true,
    username,
  });
  deleteServerlessService('demo-dashboard-server', { username });
});

// Remove website
deleteServerlessService('demo-website', { isClient: true });
