#!/usr/bin/env node

const path = require('path');
const https = require('https');

const AWS = require('aws-sdk');
const promisePipe = require('promisepipe');
const unzip = require('unzip');
const { argv } = require('yargs');

const runner = async () => {
  const { REGION, AWS_LAMBDA_HANDLER_PATH } = process.env;
  const { event: e, context: c } = argv;
  const context = JSON.parse(c);
  const event = JSON.parse(e);

  if (!context.functionName) {
    return console.error('Required function name not found in context.');
  }

  const invoking = context.functionName;
  // Assumes dead letter queue lambda functions are suffixed with Dlq
  const originalInvoking = invoking.substring(0, invoking.indexOf('Dlq'));

  try {
    const lambda = new AWS.Lambda({ region: REGION });

    const lambdaInfo = await lambda
      .getFunction({ FunctionName: originalInvoking })
      .promise();

    const sourceCodeSignedUrl = lambdaInfo.Code.Location;

    return https.get(sourceCodeSignedUrl, async res => {
      // Download source from cloud and extract it at the current directory at the same time.
      await promisePipe(res, unzip.Extract({ path: __dirname }));

      const pathToHandler = path.resolve(
        `${__dirname}/${AWS_LAMBDA_HANDLER_PATH}`
      );

      setTimeout(async () => {
        // eslint-disable-next-line
        const handler = require(pathToHandler);
        const result = await handler.handler(event, context);
        return console.log(result);
      }, 1500);
    });
  } catch (err) {
    return console.error(err.message);
  }
};

runner();
