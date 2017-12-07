// Get config
const config = require(`../../config.json`); // eslint-disable-line import/no-unresolved
const protectMe = ['test', 'acc', 'prod'];

module.exports = () => {
  if (protectMe.includes(config.stage)) {
    console.log(`You are on protected stage ${config.stage}`);
    process.exit();
  }
};
