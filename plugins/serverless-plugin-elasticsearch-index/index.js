const AWS = require('aws-sdk');
const awscred = require('awscred');
const connectionClass = require('http-aws-es');
const elasticsearch = require('elasticsearch');
const isEqual = require('lodash.isequal');
const { promisify } = require('util');

const getExportValueByName = require('./lib/getExportValueByName');

const getUserCredentials = promisify(awscred.load);

class CreateElasticIndexDeploy {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.hooks = {
      'after:deploy:deploy': this.afterDeployment.bind(this),
    };
  }

  afterDeployment() {
    const indices = this.serverless.service.custom.slsEsIndices;

    return Promise.all(
      indices.map(async indexConfig => {
        try {
          const credentials = await getUserCredentials();
          const { accessKeyId, secretAccessKey } = credentials.credentials;

          const { index, mapping, region, endpointName } = indexConfig;

          const domain = await getExportValueByName({
            name: endpointName,
            region,
          });

          // elasticsearch client configuration
          const esOptions = {
            index,
            connectionClass,
            apiVersion: '6.5',
            host: `https://${domain}`,
            // this is required when out of a lambda function
            awsConfig: new AWS.Config({
              accessKeyId,
              secretAccessKey,
              region,
            }),
          };

          const client = elasticsearch.Client(esOptions);

          const exists = await client.indices.exists({ index });

          if (!exists) {
            return client.indices.create({ index, body: mapping });
          }

          const existingMappping = await client.indices.getMapping({ index });

          if (!isEqual(existingMappping[index], mapping)) {
            const types = Object.keys(mapping.mappings);

            return Promise.all(
              types.map(type =>
                // Update mapping (if possible)
                client.indices.putMapping({
                  index,
                  type,
                  body: mapping.mappings[type],
                })
              )
            );
          }

          return console.log('Finished updates on ES indices.');
        } catch (error) {
          throw error;
        }
      })
    );
  }
}

module.exports = CreateElasticIndexDeploy;
