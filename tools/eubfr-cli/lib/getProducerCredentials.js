const config = require('../../../config.json'); // eslint-disable-line import/no-unresolved

module.exports = producer => {
  if (!config) {
    throw new Error('Please create config.json file in project root.');
  }

  if (config.demo[producer]) {
    return config.demo[producer];
  } else {
    return null;
  }
};
