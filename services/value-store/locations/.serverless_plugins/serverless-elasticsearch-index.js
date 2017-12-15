// we'll need the SDK, because of repeated issue with credentials inheritance
// in the https-aws-es and its connector
// read more https://github.com/TheDeveloper/http-aws-es/search?q=Data+must+be+a+string+or+a+buffer&type=Issues&utf8=%E2%9C%93
const AWS = require('aws-sdk');
// get a helper from the serverless framework, we'll need to deal with credentials
// and we don't want to re-invent the logic of discovering the user's credentials
const awsConfigCredentials = require('serverless/lib/plugins/aws/configCredentials/awsConfigCredentials');

// all the dependencies to work with elasticsearch out of the serverless framework
const elasticsearch = require('elasticsearch');
const connectionClass = require('http-aws-es');
const elasticsearchOutput = require('../../elasticsearch/.serverless/stack-output.json');
const config = require('../../../../config.json');

// elasticsearch mapping https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping.html
const LocationMapping = require('../src/mappings/location');

class CreateElasticIndexDeploy {
  constructor(serverless, options) {
    // Setup serverless instance:
    this.serverless = serverless;
    this.options = options;

    this.hooks = {
      'after:deploy:deploy': this.afterDeployment.bind(this),
    };

    // Setup credentials:
    // connect parameters of our constructor to the one of the helper utility
    // so that we connect the serverless client instances
    const slsAwsConfig = new awsConfigCredentials(
      this.serverless,
      this.options
    );
    // get the user credentials, just as the serverless framework would
    const awsConfig = slsAwsConfig.getCredentials();
    const accessKeyId = awsConfig[1].split(' = ')[1];
    const secretAccessKey = awsConfig[2].split(' = ')[1];

    // Setup elasticsearch:
    // get configuration from serverless.yml file
    const { esIndex, esIndexType } = this.serverless.service.custom.slsEsIndex;

    // get the domain endpoint
    const { ServiceEndpoint } = elasticsearchOutput;

    // elasticsearch client configuration
    const esOptions = {
      index: esIndex,
      connectionClass,
      apiVersion: '5.5',
      host: `https://${ServiceEndpoint}`,
      // this is required when out of a lambda function
      awsConfig: new AWS.Config({
        accessKeyId,
        secretAccessKey,
        region: config.region,
      }),
    };

    // elasticsearch client instantiation
    const client = elasticsearch.Client(esOptions);

    // handle instance scope for class properties
    this.client = client;
    this.esIndex = esIndex;
    this.esIndexType = esIndexType;
    this.ServiceEndpoint = ServiceEndpoint;
  }

  // Create elasticsearch index after deployment has finished
  afterDeployment() {
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
          body: LocationMapping,
        })
      );
  }
}

module.exports = CreateElasticIndexDeploy;
