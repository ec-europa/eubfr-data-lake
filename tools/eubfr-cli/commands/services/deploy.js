const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');

const shell = promisify(exec);

// Utilities
const getServices = require('../../lib/getServices');
const getServiceLocation = require('../../lib/getServiceLocation');

const deployServices = async ({ services, producer }) => {
  const slsBin = path.resolve(
    require.resolve('serverless'),
    '../../bin/serverless'
  );

  // EUBFR_USERNAME can override flags.
  const selectedProducer = process.env.EUBFR_USERNAME || producer;
  const list = getServices(services);
  const servicesToDeploy = [];

  // Handle producer-specific cases.
  if (selectedProducer && selectedProducer !== '*') {
    list.forEach(service => {
      // If it's not an ETL, simply keep it.
      if (!service.service.includes(`ingestion-etl-`)) {
        servicesToDeploy.push(service);
      }
      // Otherwise, if it's an ETL, keep it only if it's related to the selected producer.
      else if (service.service.includes(`ingestion-etl-${selectedProducer}`)) {
        servicesToDeploy.push(service);
      }
    });
  }
  // Deploy everything as-is.
  else {
    servicesToDeploy.push(...list);
  }

  // Using for-of on purpose for a sequential resolution of promises.
  // eslint-disable-next-line
  for (const service of servicesToDeploy) {
    const serviceName = service.service;
    const cwd = path.resolve(`${getServiceLocation(serviceName)}`);

    try {
      console.log(`Deploying ${serviceName}`);
      console.time(serviceName);
      // Deploy the service.
      // eslint-disable-next-line
      await shell(`${slsBin} deploy`, { cwd });
      if (service.exportEnv) {
        // Export environment variables.
        // eslint-disable-next-line
        await shell(`${slsBin} export-env`, { cwd });
        console.log(`.env exported for ${serviceName}`);
      }
      console.log(`${serviceName} has been deployed`);
      console.timeEnd(serviceName);
    } catch (e) {
      console.error(e);
    }
  }
};

module.exports = deployServices;
