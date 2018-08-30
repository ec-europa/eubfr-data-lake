#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

const AWS = require('aws-sdk');
const { argv } = require('yargs');
const unzip = require('unzip');

// const awscred = require('awscred');
// const getUserCredentials = promisify(awscred.load);

// Runner definition
const runner = async () => {
  // Get original event and context.
  console.log(JSON.stringify(argv));
  const { event, context: c } = argv;
  const context = JSON.parse(c);

  if (!context.functionName) {
    return console.error('Required function name not found in context.');
  }
  const invoking = context.functionName;
  const originalInvoking = invoking.substring(0, invoking.indexOf('Dlq'));

  try {
    const lambda = new AWS.Lambda({ region: 'eu-central-1' });

    const response = await lambda
      .getFunction({ FunctionName: originalInvoking })
      .promise();

    const sourceCodeSignedUrl = response.Code.Location;

    return new Promise((resolve, reject) => {
      https
        .get(sourceCodeSignedUrl, res => {
          res.pipe(fs.createWriteStream('./handler.zip'));
          res.on('end', () => {
            const source = path.resolve(`${__dirname}/handler.zip`);
            const sourceZip = fs.createReadStream(source);
            sourceZip.pipe(unzip.Extract({ path: __dirname }));
            sourceZip.on('end', async () => {
              const pathToHandler = path.resolve(
                `${__dirname}/src/events/onParseCSV.js`
              );
              const handler = require(pathToHandler);
              const result = await handler.handler(event, context);
              console.log(result);
              resolve();
            });
          });
        })
        .on('error', reject);
    });
  } catch (e) {
    return console.error(e.message);
  }
};

// Execute the runner.
runner();
