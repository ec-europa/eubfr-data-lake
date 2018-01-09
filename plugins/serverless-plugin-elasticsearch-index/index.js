const AWS = require('aws-sdk');
const AwsConfigCredentials = require('serverless/lib/plugins/aws/configCredentials/awsConfigCredentials');
const elasticsearch = require('elasticsearch');
const connectionClass = require('http-aws-es');
const listExports = require('../lib/listExports');

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

  async setupElasticClient() {
    const accessKeyId = this.awsConfig[1].split(' = ')[1];
    const secretAccessKey = this.awsConfig[2].split(' = ')[1];

    // Setup elasticsearch:
    // get configuration from serverless.yml file
    const pluginConfig = this.serverless.service.custom.slsEsIndex;
    // Get specific plugin configurations
    const { region, index, type, mapping } = pluginConfig;

    const exportedVariables = await listExports(this.serverless.providers.aws);

    // Map endpointName with the actual ES domain
    const domain = exportedVariables.find(
      exp => exp.Name === pluginConfig.endpointName
    ).Value;

    // elasticsearch client configuration
    const esOptions = {
      index,
      connectionClass,
      apiVersion: '6.0',
      host: `https://${domain}`,
      // this is required when out of a lambda function
      awsConfig: new AWS.Config({
        accessKeyId,
        secretAccessKey,
        region,
      }),
    };

    // elasticsearch client instantiation
    const client = elasticsearch.Client(esOptions);

    // class scope for elasticsearch properties
    this.client = client;
    this.index = index;
    this.type = type;
    this.domain = domain;
    this.mapping = mapping;
  }

  // Create elasticsearch index after deployment has finished
  async afterDeployment() {
    await this.setupElasticClient();

    this.client.indices
      .exists({ index: this.index })
      .then(exists => {
        if (!exists) {
          return this.client.indices.create({ index: this.index });
        }
        return exists;
      })
      .catch(() => this.client.indices.create({ index: this.index }))
      .then(() =>
        this.client.indices.getMapping({
          index: this.index,
          type: this.type,
        })
      )
      .catch(() =>
        this.client.indices.putMapping({
          index: this.index,
          type: this.type,
          body: this.mapping,
        })
      );
  }
}

module.exports = CreateElasticIndexDeploy;
