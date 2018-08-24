const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');

const shell = promisify(exec);

// Utilities
const getAvailableServices = require('../../lib/getAvailableServices');
const getServiceLocation = require('../../lib/getServiceLocation');

const deployServices = async ({ services, producer }) => {
  const list = getAvailableServices(services);
  const servicesToDeploy = [];

  // Handle producer-specific cases.
  if (producer !== '*') {
    list.forEach(service => {
      // If it's not an ETL, simply keep it.
      if (!service.service.includes(`ingestion-etl-`)) {
        servicesToDeploy.push(service);
      }
      // Otherwise, if it's an ETL, keep it only if it's related to the selected producer.
      else if (service.service.includes(`ingestion-etl-${producer}`)) {
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
      await shell('npx sls deploy', { cwd });
      if (service.exportEnv) {
        // Export environment variables.
        // eslint-disable-next-line
        await shell('npx sls export-env', { cwd });
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
