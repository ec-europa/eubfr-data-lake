const prettyjson = require('prettyjson');
const getEndpoints = require('../../lib/getEndpoints');

const envPrintCommand = () => {
  const endpoints = getEndpoints();
  console.info('Current set of environment variables:');
  console.info(prettyjson.render(endpoints));
};

module.exports = envPrintCommand;
