/**
 * Returns a list of producers.
 */
module.exports = () => {
  try {
    // This is the one the developer maintains.
    // eslint-disable-next-line
    return require('../../../config.json').demo;
  } catch (e) {
    // This one contains defaults committed in the repository and is always there.
    // eslint-disable-next-line
    return require('../../../config.example.json').demo;
  }
};
