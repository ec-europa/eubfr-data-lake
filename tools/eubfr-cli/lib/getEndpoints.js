const envfile = require('envfile');
const path = require('path');

const getServiceLocation = require('../lib/getServiceLocation');

// Places where specific environment variables are stored
const services = [
  'storage-deleter',
  'storage-signed-uploads',
  'demo-dashboard-client',
];

const getEndpoints = () => {
  const endpoints = {};

  services.forEach(service => {
    const dotEnvFile = path.resolve(`${getServiceLocation(service)}/.env`);
    const vars = envfile.parseFileSync(dotEnvFile);
    Object.keys(vars).forEach(envVariable => {
      endpoints[envVariable] = vars[envVariable];
    });
  });

  return endpoints;
};

module.exports = getEndpoints;
