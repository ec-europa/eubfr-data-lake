const AWS = require('aws-sdk');
const AwsConfigCredentials = require('serverless/lib/plugins/aws/configCredentials/awsConfigCredentials');
const elasticsearch = require('elasticsearch');
const connectionClass = require('http-aws-es');
const listExports = require('./lib/listExports');
const isEqual = require('lodash.isequal');

class CreateElasticIndexDeploy {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.hooks = {
      'after:deploy:deploy': this.afterDeployment.bind(this),
    };

    // Setup credentials:
    const slsAwsConfig = new AwsConfigCredentials(
      this.serverless,
      this.options
    );

    this.awsConfig = slsAwsConfig.getCredentials();
  }

  async setupElasticClient(config) {
    const accessKeyId = this.awsConfig[1].split(' = ')[1];
    const secretAccessKey = this.awsConfig[2].split(' = ')[1];

    // Setup elasticsearch:

    // Get specific plugin configurations
    const { region, index } = config;

    const exportedVariables = await listExports(this.serverless.providers.aws);

    // Map endpointName with the actual ES domain
    const domain = exportedVariables.find(
      exp => exp.Name === config.endpointName
    ).Value;

    // elasticsearch client configuration
    const esOptions = {
      index,
      connectionClass,
      apiVersion: '6.2',
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
