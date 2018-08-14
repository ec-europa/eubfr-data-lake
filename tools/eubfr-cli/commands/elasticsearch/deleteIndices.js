const { promisify } = require('util');
const AWS = require('aws-sdk');
const awscred = require('awscred');
const connectionClass = require('http-aws-es');
const elasticsearch = require('elasticsearch');
const getUserCredentials = promisify(awscred.load);

/**
 * Shows information indices in a given domain.
 * @see https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference-6-2.html#api-indices-delete-6-2
 */
const deleteIndices = async ({ indices, endpoints, domain }) => {
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

  // No indices are specified => delete all.
  if (indices.length === 0) {
    try {
      const deleted = client.indices.delete({ index: '*' });

      return console.log(deleted);
    } catch (e) {
      return console.error(e);
    }
  } else {
    const del = indices.map(index => client.indices.delete({ index }));

    Promise.all(del)
      .then(results => console.log(results))
      .catch(e => console.error(e));
  }
};

module.exports = deleteIndices;
