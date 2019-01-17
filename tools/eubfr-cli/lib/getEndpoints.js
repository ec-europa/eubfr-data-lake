const envfile = require('envfile');
const path = require('path');
const prettyjson = require('prettyjson');

const getServiceLocation = require('../lib/getServiceLocation');

// Places where specific environment variables are stored
const services = {
  'storage-deleter': ['DELETER_API', 'REACT_APP_ES_PRIVATE_ENDPOINT'],
  'storage-signed-uploads': ['SIGNED_UPLOADS_API'],
  'demo-dashboard-client': [
    'REACT_APP_DEMO_SERVER',
    'REACT_APP_ES_PUBLIC_ENDPOINT',
    'REACT_APP_ES_PRIVATE_ENDPOINT',
  ],
};

const getEndpoints = () => {
  const endpoints = {};

  // REACT_APP_STAGE and EUBFR_STAGE are the same thing.
  // If the CRA-prefixed one is not available from .env, try to fallback to the global one.
  if (!endpoints.REACT_APP_STAGE) {
    endpoints.REACT_APP_STAGE = process.env.EUBFR_STAGE;
  }

  Object.keys(services).forEach(service => {
    try {
      const dotEnvFile = path.resolve(`${getServiceLocation(service)}/.env`);
      const vars = envfile.parseFileSync(dotEnvFile);
      Object.keys(vars).forEach(envVariable => {
        endpoints[envVariable] = vars[envVariable];
      });
    } catch (error) {
      if (process.env.VERBOSE) {
        console.log(`${error.message}`);
        console.log(
          `Trying to get the values for ${service} from environment variables ...`
        );
      }
      services[service].forEach(
        // eslint-disable-next-line no-return-assign
        variable =>
          (endpoints[variable] = process.env[variable]
            ? process.env[variable]
            : '')
      );
    }
  });

  if (process.env.VERBOSE) {
    console.info('EUBFR CLI endpoints context:');
    console.info(prettyjson.render(endpoints));
  }

  return endpoints;
};

module.exports = getEndpoints;
