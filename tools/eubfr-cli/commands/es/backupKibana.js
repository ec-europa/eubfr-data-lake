const { promisify } = require('util');
const AWS = require('aws-sdk');
const awscred = require('awscred');
const connectionClass = require('http-aws-es');
const elasticsearch = require('elasticsearch');
const prettyjson = require('prettyjson');

const getUserCredentials = promisify(awscred.load);

/**
 * Backs up the `.kibana` index of a given ES domain host path.
 */
const backupKibana = async ({ host }) => {
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

    // Try to get information about an existing repository
    try {
      const check = await client.snapshot.getRepository({
        repository: 'kibana',
      });
      console.log(check);
    } catch (error) {
      // If not found, create one.
      if (error.displayName === 'NotFound') {
        const repo = await client.snapshot.createRepository({
          repository: 'kibana',
          body: {
            type: 's3',
            settings: {
              bucket: 'eubfr-backup',
              endpoint: region,
              role_arn: '',
            },
          },
        });
        console.log(repo);
      }
    }

    const info = await client.snapshot.create({
      repository: 'kibana',
      snapshot: 'dev',
      body: {
        type: 's3',
        settings: {
          bucket: 'eubfr-backup',
          compress: true,
          region,
          role_arn: '',
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
