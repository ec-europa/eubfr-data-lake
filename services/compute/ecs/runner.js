#!/usr/bin/env node

const { argv } = require('yargs');

// Accept dynamic parameters passed as environment variables from the container.
console.log(argv);

// runner accepts (event, context) from handler invoking the ECS task

// Use context.invokedFunctionArn

// Use https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#getFunction-property
// Get the bundled function and build the information about the lambda handler.

// Invoke the built/bundled handler with the original (event, context) inside the container which does not timeout
// Permissions are already attached on arn:aws:iam::491621799026:role/ecsTaskExecutionRole which will be used by the container's code.
