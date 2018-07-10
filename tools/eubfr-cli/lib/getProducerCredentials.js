const config = require('../../../config.json'); // eslint-disable-line import/no-unresolved

/**
 *
 *  Returns an object with credentials for AWS' aws4 signed request for a given producer.
 *
 * @param {String} producer Producer's name, i.e. agri, budg, etc.
 * @returns {Object} Producer's AWS IAM secrets.
 *
 */
module.exports = producer => {
  if (!config) {
    return console.error('Please create config.json file in project root.');
  }

  if (config.demo[producer]) {
    const credentials = config.demo[producer];
    const accessKeyId = credentials.AWS_ACCESS_KEY_ID;
    const secretAccessKey = credentials.AWS_SECRET_ACCESS_KEY;

    if (!accessKeyId || !secretAccessKey) {
      return console.error(`Please verify ${producer}'s credentials.`);
    }
    return {
      accessKeyId,
      secretAccessKey,
    };
  }

  console.error(`Couldn't find credentials for producer ${producer}`);
  return {};
};
