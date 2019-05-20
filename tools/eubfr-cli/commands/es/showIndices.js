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
const showIndices = async ({ indices, host }) => {
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

    // No indices are specified => show all.
    if (indices.length === 0) {
      const info = await client.indices.stats({
        index: '_all',
        level: 'indices',
      });

      return console.log(prettyjson.render(info));
    }

    const getIndices = indices.map(index =>
      client.indices.stats({
        index,
        level: 'indices',
      })
    );

    const results = await Promise.all(getIndices);
    return console.log(prettyjson.render(results));
  } catch (e) {
    return console.error(e);
  }
};

module.exports = showIndices;
