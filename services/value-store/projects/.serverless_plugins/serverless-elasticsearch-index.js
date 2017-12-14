const elasticsearch = require('elasticsearch');
const connectionClass = require('http-aws-es');
const elasticsearchOutput = require('../../elasticsearch/.serverless/stack-output.json');
const AWS = require('aws-sdk');

const ProjectMapping = require('../src/mappings/project');

class CreateElasticIndexDeploy {
  constructor(serverless, options) {
    // Serverless framework setup
    this.serverless = serverless;
    this.options = options;

    this.hooks = {
      'after:deploy:deploy': this.afterDeployment.bind(this),
    };

    // AWS sdk setup
    const awsCredentials = this.serverless.getProvider('aws').getCredentials();

    // Default credentials seem not to be taken by default
    AWS.config.update({
      credentials: awsCredentials.credentials,
      region: awsCredentials.region,
    });

    // elasticsearch setup
    // get configuration from serverless.yml file
    const { esIndex, esIndexType } = this.serverless.service.custom.slsEsIndex;

    // get the domain endpoint
    const { ServiceEndpoint } = elasticsearchOutput;

    // elasticsearch client configuration
    const esOptions = {
      host: `https://${ServiceEndpoint}`,
      apiVersion: '5.5',
      connectionClass,
      index: esIndex,
    };

    // elasticsearch client instantiation
    const client = elasticsearch.Client(esOptions);

    // properties for the methods
    this.client = client;
    this.esIndex = esIndex;
    this.esIndexType = esIndexType;
    this.ServiceEndpoint = ServiceEndpoint;
  }

  afterDeployment() {
    // this.client.info().then(console.log);
    this.client.indices
      .exists({ index: this.esIndex })
      .then(exists => {
        if (!exists) {
          return this.client.indices.create({ index: this.esIndex });
        }
        return exists;
      })
      .catch(() => {
        return this.client.indices.create({ index: this.esIndex });
      })
      .then(() =>
        this.client.indices.getMapping({
          index: this.esIndex,
          type: this.esIndexType,
        })
      )
      .catch(() =>
        this.client.indices.putMapping({
          index: this.esIndex,
          type: this.esIndexType,
          body: ProjectMapping,
        })
      );
  }
}

module.exports = CreateElasticIndexDeploy;
