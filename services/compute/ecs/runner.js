#!/usr/bin/env node

const path = require('path');
const https = require('https');

const AWS = require('aws-sdk');
const promisePipe = require('promisepipe');
const unzip = require('unzipper');
const { argv } = require('yargs');

const runner = async () => {
  const {
    REGION,
    AWS_LAMBDA_HANDLER_NAME,
    AWS_LAMBDA_HANDLER_PATH,
  } = process.env;
  const { event: e, context: c } = argv;
  const context = JSON.parse(c);
  const event = JSON.parse(e);

  try {
    const lambda = new AWS.Lambda({ region: REGION });

    const lambdaInfo = await lambda
      .getFunction({ FunctionName: AWS_LAMBDA_HANDLER_NAME })
      .promise();

    const sourceCodeSignedUrl = lambdaInfo.Code.Location;

    return https.get(sourceCodeSignedUrl, async res => {
      // Download source from cloud and extract it at the current directory at the same time.
      await promisePipe(res, unzip.Extract({ path: __dirname }));

      const pathToHandler = path.resolve(
        `${__dirname}/${AWS_LAMBDA_HANDLER_PATH}`
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

runner();
