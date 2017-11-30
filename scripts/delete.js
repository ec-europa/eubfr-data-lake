#!/usr/bin/env node

// Dependencies
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get config
const config = require(`../config.json`);

// Easier to edit in the beginning of the file
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

// Helpers
const resolveSymbolicLink = filePath => {
  const lstat = fs.lstatSync(filePath);
  return lstat.isSymbolicLink()
    ? path.resolve(path.dirname(filePath), fs.readlinkSync(filePath))
    : false;
};

const deleteServerlessService = service => {
  console.log(`Start deletion of ${service}`);
  console.time(service);

  const operation = spawn(
    `./node_modules/.bin/sls`,
    ['remove', `--stage ${config.stage}`, `--region ${config.region}`],
    {
      cwd: resolveSymbolicLink(`node_modules/@eubfr/${service}`),
    }
  );

  operation.stdout.on('data', data => {
    console.log('\x1b[36m', `${data}`, '\x1b[0m');
  });

  operation.stderr.on('data', data => {
    console.log('\x1b[31m', `${data}`, '\x1b[31m');
  });

  operation.on('close', () => console.timeEnd(service));
};

// And run the deletion procedure
services.forEach(deleteServerlessService);
