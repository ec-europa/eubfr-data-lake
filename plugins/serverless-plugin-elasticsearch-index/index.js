const AWS = require('aws-sdk');
const awscred = require('awscred');
const elasticsearch = require('elasticsearch');
const connectionClass = require('http-aws-es');
const isEqual = require('lodash.isequal');
const getExportValueByName = require('./lib/getExportValueByName');
const { promisify } = require('util');

const getUserCredentials = promisify(awscred.load);

class CreateElasticIndexDeploy {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.hooks = {
      'after:deploy:deploy': this.afterDeployment.bind(this),
    };
  }

  async setupElasticClient(config) {
    // Get user's AWS credentials.
    const credentials = await getUserCredentials();
    const { accessKeyId, secretAccessKey } = credentials.credentials;

    // Setup elasticsearch.

    // Get specific plugin configurations.
    const { region, index } = config;

    const domain = await getExportValueByName({
      name: config.endpointName,
      region,
    });

    // elasticsearch client configuration
    const esOptions = {
      index,
      connectionClass,
      apiVersion: '6.3',
      host: `https://${domain}`,
      // this is required when out of a lambda function
      awsConfig: new AWS.Config({
        accessKeyId,
        secretAccessKey,
        region,
      }),
    };

    // elasticsearch client instantiation
    return elasticsearch.Client(esOptions);
  }

  // Create elasticsearch index after deployment has finished
  async afterDeployment() {
    const indices = this.serverless.service.custom.slsEsIndices;

    await indices.forEach(async indexConfig => {
      const client = await this.setupElasticClient(indexConfig);
      const { index, mapping } = indexConfig;

      client.indices.exists({ index }).then(exists => {
        if (!exists) {
          return client.indices.create({ index, body: mapping });
        }

        return client.indices.getMapping({ index }).then(existingMappping => {
          if (!isEqual(existingMappping[index], mapping)) {
            const types = Object.keys(mapping.mappings);

            types.forEach(type =>
              // Update mapping (if possible)
              client.indices.putMapping({
                index,
                type,
                body: mapping.mappings[type],
              })
            );
          }
        });
      });
    });
  }
}

module.exports = CreateElasticIndexDeploy;
