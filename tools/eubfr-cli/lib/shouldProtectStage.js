const getConfigurations = require('./getConfigurations');

const { stage } = getConfigurations();

/**
 * Returns information whether a currently used stage is save to be deleted.
 *
 * @returns {boolean} Whether current stage should be protected.
 */
const shouldProtectStage = () => {
  // Protect certain stages from deletion.
  if (['test', 'acc', 'prod'].includes(stage)) {
    return true;
  }

  return false;
};

module.exports = shouldProtectStage;
