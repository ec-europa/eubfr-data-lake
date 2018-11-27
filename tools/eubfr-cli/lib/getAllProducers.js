/**
 * Returns a list of producers.
 */
module.exports = () => {
  let producers = [];

  try {
    // This is the one the developer maintains.
    // eslint-disable-next-line
    producers = require('../../../config.json').demo;
  } catch (e) {
    // This one contains defaults committed in the repository and is always there.
    // eslint-disable-next-line
    producers = require('../../../config.example.json').demo;
  }

  return producers;
};
