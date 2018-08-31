#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

const AWS = require('aws-sdk');
const promisePipe = require('promisepipe');
const unzip = require('unzip');
const { argv } = require('yargs');

// Runner definition
const runner = async () => {
  const { event: e, context: c } = argv;
  const context = JSON.parse(c);
  const event = JSON.parse(e);

  if (!context.functionName) {
    return console.error('Required function name not found in context.');
  }

  const invoking = context.functionName;
  const originalInvoking = invoking.substring(0, invoking.indexOf('Dlq'));

  try {
    const lambda = new AWS.Lambda({ region: 'eu-central-1' });

    const lambdaInfo = await lambda
      .getFunction({ FunctionName: originalInvoking })
      .promise();

    const sourceCodeSignedUrl = lambdaInfo.Code.Location;
    // Target archive containing the original handler's code.
    const source = path.resolve(`${__dirname}/handler.zip`);

    return https.get(sourceCodeSignedUrl, async res => {
      // Get the zip and write to the FS.
      await promisePipe(res, fs.createWriteStream('./handler.zip'));

      // Extract the zip in the current directory.
      await promisePipe(
        fs.createReadStream(source),
        unzip.Extract({ path: __dirname })
      );

      const pathToHandler = path.resolve(
        `${__dirname}/src/events/onParseCSV.js`
      );
      // eslint-disable-next-line
      const handler = require(pathToHandler);
      const result = await handler.handler(event, context);
      return console.log(result);
    });
  } catch (err) {
    return console.error(err.message);
  }
};

// Execute the runner.
runner();
