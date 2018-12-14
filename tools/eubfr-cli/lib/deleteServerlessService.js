const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');

const shell = promisify(exec);

// Utilities
const getConfigurations = require('../lib/getConfigurations');
const getServiceLocation = require('../lib/getServiceLocation');

module.exports = async (service, { isClient = false, username = '' }) => {
  const slsBin = path.resolve(
    require.resolve('serverless'),
    '../../bin/serverless'
  );
  const { stage, region } = getConfigurations();
  const cwd = path.resolve(`${getServiceLocation(service)}`);
  if (username) {
    process.env.EUBFR_USERNAME = username;
  }
  const serviceName = `${service}${username ? `-${username}` : ''}${
    isClient ? ' (client)' : ''
  }`;

  try {
    console.log(`Deleting ${serviceName} ...`);
    console.time(serviceName);
    if (isClient) {
      await shell(`${slsBin} client remove --no-confirm`, { cwd });
    } else {
      await shell(`${slsBin} remove --stage ${stage} --region ${region}`, {
        cwd,
      });
    }
    console.log(`${serviceName} has been deleted.`);
    return console.timeEnd(serviceName);
  } catch (e) {
    return console.error(e);
  }
};
