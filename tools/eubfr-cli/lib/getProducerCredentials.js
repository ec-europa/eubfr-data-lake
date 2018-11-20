const AWS = require('aws-sdk');

/**
 *  Returns an object with credentials for AWS' aws4 signed request for a given producer.
 *
 * @param {String} producer Producer's name, i.e. agri, budg, etc.
 * @returns {Object} Producer's AWS IAM secrets.
 *
 */
module.exports = async producer => {
  const secretsManager = new AWS.SecretsManager();

  try {
    const secretsResponse = await secretsManager
      .getSecretValue({ SecretId: `producers/${producer}` })
      .promise();

    const secrets = JSON.parse(secretsResponse.SecretString);

    const {
      AWS_ACCESS_KEY_ID: accessKeyId,
      AWS_SECRET_ACCESS_KEY: secretAccessKey,
    } = secrets;

    return {
      accessKeyId,
      secretAccessKey,
    };
  } catch (e) {
    return console.error(`Couldn't find credentials for producer ${producer}`);
  }
};
