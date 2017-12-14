const elasticsearch = require('elasticsearch');
const connectionClass = require('http-aws-es');
const elasticsearchOutput = require('../../elasticsearch/.serverless/stack-output.json');

const ProjectMapping = require('../src/mappings/project');

class CreateElasticIndexDeploy {
  constructor(serverless, options) {
    // Serverless framework setup
    this.serverless = serverless;
    this.options = options;

    this.hooks = {
      'after:deploy:deploy': this.afterDeployment.bind(this),
    };

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
    console.log('------------ After Deploy Functions');
    debugger;
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
