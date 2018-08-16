const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');

const shell = promisify(exec);

// Utilities
const getAvailableServices = require('../../lib/getAvailableServices');
const getServiceLocation = require('../../lib/getServiceLocation');

const deployServices = ({ services, producer }) => {
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

  const operations = servicesToDeploy.map(async service => {
    const serviceName = service.service;
    const cwd = path.resolve(`${getServiceLocation(serviceName)}`);

    try {
      console.log(`Deploying ${serviceName}`);
      console.time(serviceName);
      // Deploy the service.
      await shell('npx sls deploy', { cwd });
      if (service.exportEnv) {
        // Export environment variables.
        await shell('npx sls export-env', { cwd });
      }
      console.log(`${serviceName} has been deployed`);
      return console.timeEnd(serviceName);
    } catch (e) {
      return console.error(e);
    }
  });

  return Promise.all(operations);
};

module.exports = deployServices;
