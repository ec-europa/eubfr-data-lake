const { promisify } = require('util');
const AWS = require('aws-sdk');
const awscred = require('awscred');
const connectionClass = require('http-aws-es');
const elasticsearch = require('elasticsearch');
const prettyjson = require('prettyjson');

const getUserCredentials = promisify(awscred.load);

/**
 * Backs up the `.kibana` index of a given ES domain host path.
 * @see https://aws.amazon.com/blogs/database/use-amazon-s3-to-store-a-single-amazon-elasticsearch-service-index/
 * Policy and role with name `eubfr-es-repository` have already been created in the EUBFR AWS account, no need to do that through sls and CF.
 * And the connection between `eubfr-es-repository` policy doc and `eubfr-es-repository` role has been already made.
 * You now use the role that sets up a trust relationship between Amazon ES and Amazon S3, allowing Amazon ES to write to S3 bucket.
 */
const backupKibana = async ({ host }) => {
  // For the moment, same name, but keeping it flexible.
  // Created by resources/backup-storage
  const bucket = 'eubfr-es-repository';
  // Created already once in the AWS console
  const role = 'eubfr-es-repository';

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
    // Get information about the ES role with access to S3
    const iam = new AWS.IAM();
    const roleDetalis = await iam.getRole({ RoleName: role }).promise();

    // Try to get information about an existing repository
    try {
      console.log('Check for existing repository for Kibana ...');
      const check = await client.snapshot.getRepository({
        repository: 'kibana',
      });
      console.log(check);
    } catch (error) {
      if (error.displayName === 'NotFound') {
        console.log('Kibana repository not found, creting one ...');
        const repo = await client.snapshot.createRepository({
          repository: 'kibana',
          body: {
            type: 's3',
            settings: {
              bucket,
              endpoint: region,
              role_arn: roleDetalis.Role.Arn,
            },
          },
        });
        console.log(repo);
      }
    }

    console.log('Creating a snapshot for Kibana index ...');

    const info = await client.snapshot.create({
      repository: 'kibana',
      snapshot: 'dev',
      body: {
        type: 's3',
        settings: {
          bucket,
          compress: true,
          region,
          role_arn: roleDetalis.Role.Arn,
        },
      },
    });

    console.log(info);

    return console.log(prettyjson.render(info));
  } catch (e) {
    return console.error(e);
  }
};

module.exports = backupKibana;
