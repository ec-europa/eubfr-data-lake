const url = require('url');
const path = require('path');

const aws4 = require('aws4');
const dotenv = require('dotenv');
const elasticsearch = require('elasticsearch');
const request = require('request-promise-native');

const getServiceLocation = require('../lib/getServiceLocation');

dotenv.config({
  path: path.resolve(getServiceLocation('storage-deleter'), '.env'),
});

/**
 * Deletes files from S3 for a given producer.
 *
 * @param {Array} files
 *   List of files to delete.
 * @param {Array} credentials
 *   List of credentials for the producers.
 */
const deleteCommand = async ({ files, credentials }) => {
  if (!process.env.DELETER_API) {
    console.error(
      "DELETER_API environment variable is missing. Please redeploy by running 'yarn deploy' from project root or run 'npx serverless export-env' in @eubfr/storage-deleter service if you have already deployed your infrastructure, but don't have the necessary .env files."
    );
    process.exit(1);
  }

  // Prepare variables for further requests.
  const resource = 'storage/delete';
  const api = url.parse(`https://${process.env.DELETER_API}`);
  const uri = `https://${process.env.DELETER_API}/${resource}`;
  const resourcePath = `${api.path}/${resource}`;

  const index = `${process.env.REACT_APP_STAGE}-meta`;
  const host = `https://${process.env.REACT_APP_ES_PRIVATE_ENDPOINT}`;

  const client = elasticsearch.Client({
    host,
    log: 'warning',
    apiVersion: '6.2',
  });

  // Reuse throughout the two delete approaches.
  const deleteFile = async (computedKey, creds) => {
    try {
      const params = {
        uri,
        host: api.host,
        path: resourcePath,
        headers: {
          'x-amz-meta-computed-key': computedKey,
        },
      };

      console.time(`${computedKey} has been deleted`);

      await request.get(aws4.sign(params, creds));

      return console.timeEnd(`${computedKey} has been deleted`);
    } catch (e) {
      return console.error(e);
    }
  };

  // Marker to delete all files for all producers
  if (files.length === 0) {
    return Promise.all(
      credentials.map(async producer => {
        const producerName = Object.keys(producer)[0];
        const creds = producer[producerName];

        // Get all the files uploaded by the given producer
        try {
          const response = await client.search({
            index,
            type: 'file',
            body: {
              query: {
                term: {
                  producer_id: producerName,
                },
              },
            },
          });

          const allFiles =
            response.hits && response.hits.hits
              ? response.hits.hits.map(file => file._source.computed_key)
              : [];

          return Promise.all(
            allFiles.map(async computedKey => deleteFile(computedKey, creds))
          );
        } catch (e) {
          return console.error(e);
        }
      })
    );
  }

  // In case files are specified, delete them.
  return Promise.all(
    files.map(async file => {
      const producerKey = file.split('/')[0];
      const match = credentials.find(secret => secret[producerKey]);
      return deleteFile(file, match[producerKey]);
    })
  );
};

module.exports = deleteCommand;
