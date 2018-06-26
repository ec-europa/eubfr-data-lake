#!/usr/bin/env node

// Dependencies
const shell = require('shelljs');
const config = require('../../config'); // eslint-disable-line import/no-unresolved

Object.keys(config.demo).forEach(producer => {
  console.log(`Deleting content of ${producer}`);

  shell.exec(`npx eubfr-cli delete --producer ${producer} --confirm`);
});
