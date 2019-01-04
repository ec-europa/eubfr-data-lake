const url = require('url');
const aws4 = require('aws4');
const elasticsearch = require('elasticsearch');
const request = require('request-promise-native');

const deleteFile = async ({ computedKey, creds, requestParams }) => {
  try {
    const params = {
      uri: requestParams.uri,
      host: requestParams.api.host,
      path: requestParams.resourcePath,
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

/**
 * Deletes files from S3 for a given producer.
 *
 * @param {Array} files
 *   List of files to delete.
 * @param {Array} credentials
 *   List of credentials for the producers.
 */
const deleteCommand = ({ files, credentials, endpoints }) => {
  // Prepare variables for further requests.
  const resource = 'storage/delete';
  const api = url.parse(`https://${endpoints.DELETER_API}`);
  const uri = `https://${endpoints.DELETER_API}/${resource}`;
  const resourcePath = `${api.path}/${resource}`;

  const index = `${endpoints.REACT_APP_STAGE}-meta`;
  const host = `https://${endpoints.REACT_APP_ES_PRIVATE_ENDPOINT}`;

  const requestParams = { uri, api, resourcePath };

  const client = elasticsearch.Client({
    host,
    log: 'warning',
    apiVersion: '6.3',
  });

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
            allFiles.map(async computedKey =>
              deleteFile({ computedKey, creds, requestParams })
            )
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
      return deleteFile({
        computedKey: file,
        creds: match[producerKey],
        requestParams,
      });
    })
  );
};

module.exports = deleteCommand;
