const { promisify } = require('util');
const AWS = require('aws-sdk');
const awscred = require('awscred');
const connectionClass = require('http-aws-es');
const elasticsearch = require('elasticsearch');
const prettyjson = require('prettyjson');

const getUserCredentials = promisify(awscred.load);

/**
 * Shows information about a given cluster behind a domain.
 * @see https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference-6-2.html#api-info-6-2
 */
const showCluster = async host => {
  try {
    // Get user's AWS credentials and region
    const credentials = await getUserCredentials();

    const { region } = credentials;
    const { accessKeyId, secretAccessKey } = credentials.credentials;

    // elasticsearch client configuration
    const esOptions = {
      host,
      connectionClass,
      apiVersion: '6.5',
      awsConfig: new AWS.Config({
        accessKeyId,
        secretAccessKey,
        region,
      }),
    };

    const client = elasticsearch.Client(esOptions);
    const info = await client.info();

    return console.log(prettyjson.render(info));
  } catch (e) {
    return console.error(e);
  }
};

module.exports = showCluster;
