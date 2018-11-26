/**
 * Get EUBFR project-specific configurations in a flexible way.
 */
const getConfigurations = () => {
  let configurations = {};

  try {
    // eslint-disable-next-line
    const config = require('../../../config.json');
    const { stage, username, region, eubfr_env: environment } = config;
    configurations = { stage, username, region, environment };
  } catch (e) {
    const {
      EUBFR_STAGE: stage,
      EUBFR_ENV: environment,
      EUBFR_USERNAME: username,
      EUBFR_AWS_REGION: region,
    } = process.env;

    configurations = { stage, username, region, environment };
  }

  return configurations;
};

module.exports = getConfigurations;
