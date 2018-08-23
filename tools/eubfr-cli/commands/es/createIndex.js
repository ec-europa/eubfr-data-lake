const { promisify } = require('util');
const AWS = require('aws-sdk');
const awscred = require('awscred');
const connectionClass = require('http-aws-es');
const elasticsearch = require('elasticsearch');

const getUserCredentials = promisify(awscred.load);

/**
 * Creates an index in a given domain.
 * @see https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference-6-2.html#api-indices-create-6-2
 */
const createIndex = async ({ index, mapping, type, host }) => {
  try {
    // Get user's AWS credentials and region
    const credentials = await getUserCredentials();

    const { region } = credentials;
    const { accessKeyId, secretAccessKey } = credentials.credentials;

    // elasticsearch client configuration
    const esOptions = {
      host,
      connectionClass,
      apiVersion: '6.2',
      awsConfig: new AWS.Config({
        accessKeyId,
        secretAccessKey,
        region,
      }),
    };

    const client = elasticsearch.Client(esOptions);

    const indexExists = await client.indices.exists({ index });

    if (indexExists) {
      return console.log(
        `${index} already exists. If you want to update mapping, create the index anew setting the particular mapping.`
      );
    }

    const created = await client.indices.create({ index });

    if (created.acknowledged === true) {
      console.log(`${created.index} has been created successfully.`);
    }

    // mappings property is a marker that a user-defined value has been passed and not empty default
    if (mapping.mappings) {
      const mappingCreated = await client.indices.putMapping({
        index,
        type,
        body: mapping.mappings,
      });

      if (mappingCreated.acknowledged) {
        return console.log(
          `Mapping for ${type} has been applied successfully on ${index}`
        );
      }
    }

    // If creating the index was enough, end the process.
    return console.log('All done, no mapping to create.');
  } catch (e) {
    return console.error(e);
  }
};

module.exports = createIndex;
