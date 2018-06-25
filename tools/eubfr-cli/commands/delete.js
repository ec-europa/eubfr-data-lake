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
 * @param {Boolean} deleteAll
 *   Flag whether to delete all files.
 * @param {String} producer
 *   The name of the producer, as in producer_id field. Example: 'agri'
 * @param {Object} credentials
 *   The producer's credentials which define where the file will go.
 */
const deleteCommand = async ({ files, deleteAll, producer, credentials }) => {
  if (!process.env.DELETER_API) {
    return console.error(
      "DELETER_API environment variable is missing. Please redeploy by running 'yarn deploy' from project root"
    );
  }

  // Prepare variables for further requests.
  const resource = 'storage/delete';
  const api = url.parse(`https://${process.env.DELETER_API}`);
  const uri = `https://${process.env.DELETER_API}/${resource}`;
  const resourcePath = `${api.path}/${resource}`;

  const index = `${process.env.REACT_APP_STAGE}-meta`;
  const host = `https://${process.env.REACT_APP_ES_PRIVATE_ENDPOINT}`;

  // Reuse throughout the two delete approaches.
  const deleteFile = async computedKey => {
    try {
      const params = {
        uri,
        host: api.host,
        path: resourcePath,
        headers: {
          'x-amz-meta-computed-key': computedKey,
        },
      };

      console.log(`Deleting ${computedKey} ...`);
      await request.get(aws4.sign(params, credentials));
      return console.log(`${computedKey} has been deleted`);
    } catch (e) {
      return console.error(e);
    }
  };

  if (deleteAll) {
    const client = elasticsearch.Client({
      host,
      log: 'warning',
      apiVersion: '6.2',
    });

    // Get all the files uploaded by the fi
    const response = await client.search({
      index,
      type: 'file',
      body: {
        query: {
          term: {
            producer_id: producer,
          },
        },
      },
    });
    // And delete the files
    const allFiles = response.hits.hits.map(file => file._source.computed_key);
    return allFiles.map(deleteFile);
  }

  return files.map(deleteFile);
};

// The `delete` keyword is reserved, so keep the name of the method in another way
module.exports = deleteCommand;
