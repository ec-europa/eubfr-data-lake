const { promisify } = require('util');
const AWS = require('aws-sdk');
const awscred = require('awscred');
const connectionClass = require('http-aws-es');
const elasticsearch = require('elasticsearch');
const prettyjson = require('prettyjson');
const getUserCredentials = promisify(awscred.load);

/**
 * Shows information indices in a given domain.
 * @see https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference-6-2.html#api-indices-stats-6-2
 */
const showIndices = async ({ indices, endpoints, domain }) => {
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

  const client = elasticsearch.Client(esOptions);

  // No indices are specified => show all.
  if (indices.length === 0) {
    try {
      const info = await client.indices.stats({
        index: '_all',
        level: 'indices',
      });

      return console.log(prettyjson.render(info));
    } catch (e) {
      return console.error(e);
    }
  } else {
    const getIndices = indices.map(index => {
      return client.indices.stats({
        index,
        level: 'indices',
      });
    });

    Promise.all(getIndices)
      .then(results => console.log(prettyjson.render(indices)))
      .catch(e => console.error(e));
  }
};

module.exports = showIndices;
