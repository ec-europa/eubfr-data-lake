const { promisify } = require('util');
const AWS = require('aws-sdk');
const awscred = require('awscred');
const connectionClass = require('http-aws-es');
const elasticsearch = require('elasticsearch');

const getUserCredentials = promisify(awscred.load);

/**
 * Deletes indices from a given domain.
 * @see https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference-6-2.html#api-indices-delete-6-2
 */
const deleteIndices = async ({ indices, host }) => {
  try {
    // Get user's AWS credentials and region
    const credentials = await getUserCredentials();

    const { region } = credentials;
    const { accessKeyId, secretAccessKey } = credentials.credentials;

    // elasticsearch client configuration
    const esOptions = {
      host,
      connectionClass,
      apiVersion: '6.3',
      awsConfig: new AWS.Config({
        accessKeyId,
        secretAccessKey,
        region,
      }),
    };

    const client = elasticsearch.Client(esOptions);

    // No indices are specified => delete all.
    if (indices.length === 0) {
      const deleted = client.indices.delete({ index: '*' });

      return console.log(deleted);
    }
    const del = indices.map(index => client.indices.delete({ index }));

    return Promise.all(del)
      .then(results => console.log(results))
      .catch(e => console.error(e));
  } catch (e) {
    return console.error(e);
  }
};

module.exports = deleteIndices;
