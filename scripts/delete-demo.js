#!/usr/bin/env node

// Dependencies
const deleteServerlessService = require('./utils/deleteServerlessService');

const config = require('../config'); // eslint-disable-line import/no-unresolved

const usernames = Object.keys(config.demo);

const services = [`demo-dashboard-server`];

if (!process.env.EUBFR_USERNAME) {
  console.error(`EUBFR_USERNAME environment variable is required.`);
  console.log(`Please pass one of the following: ${usernames}`);
  console.log(`For example: "EUBFR_USERNAME=${usernames[0]} yarn delete-demo"`);
} else {
  services.forEach(deleteServerlessService);
}
