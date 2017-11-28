#!/usr/bin/env node

// Dependencies
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const sh = promisify(exec);

// Get config
const config = require(`../config.json`);

// Helpers
const resolveSymbolicLink = filePath => {
  const lstat = fs.lstatSync(filePath);
  return lstat.isSymbolicLink()
    ? path.resolve(path.dirname(filePath), fs.readlinkSync(filePath))
    : false;
};

// Order is important!
const services = [
  `storage-objects`,
  `ingestion-etl-results`,
  `storage-signed-uploads`,
  `storage-deleter`,
  `storage-meta-index`,
  `harmonized-storage`,
  `ingestion-manager`,
  `ingestion-cleaner`,
  `ingestion-etl-budg-csv`,
  `ingestion-etl-budg-xls`,
  `ingestion-etl-inforegio-json`,
  `elasticsearch`,
  `value-store-projects`,
];

services.forEach(service => {
  sh(
    `./node_modules/.bin/sls remove --stage ${config.stage} --region ${config.region}`,
    {
      cwd: resolveSymbolicLink(`node_modules/@eubfr/${service}`),
    }
  )
    .then(console.log)
    .catch(console.error);
});
