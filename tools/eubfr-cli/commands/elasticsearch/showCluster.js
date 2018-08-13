const { promisify } = require('util');
const AWS = require('aws-sdk');
const awscred = require('awscred');
const connectionClass = require('http-aws-es');
const elasticsearch = require('elasticsearch');
const prettyjson = require('prettyjson');
const getUserCredentials = promisify(awscred.load);

/**
 * Shows information about a given cluster behind a domain.
 */
const showCluster = async (endpoints, domain) => {
  // Get user's AWS credentials and region
  const credentials = await getUserCredentials();

  const { region } = credentials;
  const { accessKeyId, secretAccessKey } = credentials.credentials;

  // elasticsearch client configuration
  const esOptions = {
    host: `https://${endpoints[domain]}`,
    connectionClass,
    apiVersion: '6.2',
    awsConfig: new AWS.Config({
      accessKeyId,
      secretAccessKey,
      region,
    }),
  };

  try {
    const client = elasticsearch.Client(esOptions);
    const info = await client.info();

    return console.log(prettyjson.render(info));
  } catch (e) {
    return console.error(e);
  }
};

module.exports = showCluster;
