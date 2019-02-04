const { promisify } = require('util');
const AWS = require('aws-sdk');
const awscred = require('awscred');

const getUserCredentials = promisify(awscred.load);

/**
 * Uses the credentials of a given "power" user to request secrets from AWS Secrets Manager service.
 * Returns an object with credentials for AWS' aws4 signed request for a given producer.
 *
 * @param {String} producer Producer's name
 * @returns {Object} Producer's AWS IAM secrets.
 *
 */
module.exports = async producer => {
  try {
    // These are the credentials of the user who is a developer/deployment bot/etc.
    const credentials = await getUserCredentials();

    const { region } = credentials;
    const { accessKeyId, secretAccessKey } = credentials.credentials;

    const secretsManager = new AWS.SecretsManager({
      accessKeyId,
      secretAccessKey,
      region,
    });

    const secretsResponse = await secretsManager
      .getSecretValue({ SecretId: `producers/${producer}` })
      .promise();

    const secrets = JSON.parse(secretsResponse.SecretString);

    const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = secrets;

    // These are producer's credentials.
    return {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    };
  } catch (e) {
    console.error(`Couldn't find credentials for producer ${producer}`);
    return {};
  }
};
