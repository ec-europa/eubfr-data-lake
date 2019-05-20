const { promisify } = require('util');
const AWS = require('aws-sdk');
const awscred = require('awscred');
const connectionClass = require('http-aws-es');
const elasticsearch = require('elasticsearch');
const prettyjson = require('prettyjson');
const merge = require('deepmerge');

const getUserCredentials = promisify(awscred.load);
const objectIsEmpty = obj => !Object.keys(obj).length;

/**
 * Provides a set of abstracted methods of ES client's snapshot operation.
 * General plan for this method is to be used to manage repositories, snapshots and backups of ES indices.
 * @see https://aws.amazon.com/blogs/database/use-amazon-s3-to-store-a-single-amazon-elasticsearch-service-index/
 * Policy and role with name `eubfr-es-repository` have already been created in the EUBFR AWS account, no need to do that through sls and CF.
 * And the connection between `eubfr-es-repository` policy doc and `eubfr-es-repository` role has been already made.
 * You now use the role that sets up a trust relationship between Amazon ES and Amazon S3, allowing Amazon ES to write to S3 bucket.
 */
const snapshotExec = async ({ host, method, params }) => {
  // For the moment, same name, but keeping it flexible.
  // Created by resources/backup-storage
  const bucket = 'eubfr-es-repository';
  // Created already once in the AWS console
  const role = 'eubfr-es-repository';
  // Keep empty object or parse if something is provided.
  // `inputParams` will take precedence in merge below.
  const inputParams = objectIsEmpty(params) ? {} : JSON.parse(params);

  try {
    // Get user's AWS credentials and region
    const credentials = await getUserCredentials();

    const { region } = credentials;
    const { accessKeyId, secretAccessKey } = credentials.credentials;

    // elasticsearch client configuration
    const esOptions = {
      host,
      connectionClass,
      apiVersion: '6.5',
      awsConfig: new AWS.Config({
        accessKeyId,
        secretAccessKey,
        region,
      }),
    };

    const client = elasticsearch.Client(esOptions);
    // Get information about the ES role with access to S3
    const iam = new AWS.IAM();
    const roleDetalis = await iam.getRole({ RoleName: role }).promise();

    // Narrow down list of methods in order to avoid eval().
    // And still have control (where necessary) over the default params passed to methods.
    switch (method) {
      case 'create': {
        const defaults = {};
        const mergedParams = merge(defaults, inputParams);
        const reply = await client.snapshot.create(mergedParams);
        return console.log(prettyjson.render(reply));
      }

      case 'get': {
        const defaults = {};
        const mergedParams = merge(defaults, inputParams);
        const reply = await client.snapshot.get(mergedParams);
        return console.log(prettyjson.render(reply));
      }

      case 'delete': {
        const defaults = {};
        const mergedParams = merge(defaults, inputParams);
        const reply = await client.snapshot.delete(mergedParams);
        return console.log(prettyjson.render(reply));
      }

      case 'status': {
        const defaults = {};
        const mergedParams = merge(defaults, inputParams);
        const reply = await client.snapshot.status(mergedParams);
        return console.log(prettyjson.render(reply));
      }

      case 'restore': {
        const defaults = {};
        const mergedParams = merge(defaults, inputParams);
        const reply = await client.snapshot.restore(mergedParams);
        return console.log(prettyjson.render(reply));
      }

      case 'getRepository': {
        const defaults = {
          repository: [],
        };
        const mergedParams = merge(defaults, inputParams);
        const reply = await client.snapshot.getRepository(mergedParams);
        return console.log(prettyjson.render(reply));
      }

      case 'createRepository': {
        const defaults = {
          body: {
            type: 's3',
            settings: {
              bucket,
              endpoint: region,
              role_arn: roleDetalis.Role.Arn,
            },
          },
        };

        const mergedParams = merge(defaults, inputParams);
        const reply = await client.snapshot.createRepository(mergedParams);
        return console.log(prettyjson.render(reply));
      }

      case 'deleteRepository': {
        const defaults = {
          repository: [],
        };
        const mergedParams = merge(defaults, inputParams);
        const reply = await client.snapshot.deleteRepository(mergedParams);
        return console.log(prettyjson.render(reply));
      }

      case 'verifyRepository': {
        const defaults = {};
        const mergedParams = merge(defaults, inputParams);
        const reply = await client.snapshot.verifyRepository(mergedParams);
        return console.log(prettyjson.render(reply));
      }

      default:
        console.error('Method provided does not exist in snapshot operations.');
        return console.error(
          'Please see https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference-6-2.html#api-snapshot-createrepository-6-2'
        );
    }
  } catch (e) {
    return console.error(e);
  }
};

module.exports = snapshotExec;
