const url = require('url');
const path = require('path');

const aws4 = require('aws4');
const dotenv = require('dotenv');
const request = require('request-promise-native');

const getServiceLocation = require('../lib/getServiceLocation');

dotenv.config({
  path: path.resolve(getServiceLocation('storage-deleter'), '.env'),
});

/**
 * Deletes files from S3 for a given producer.
 *
 * @param {String} computedKey
 *   The computed ID for the file to delete.
 * @param {Object} credentials
 *   The producer's credentials which define where the file will go.
 */
const upload = async ({ computedKey, credentials }) => {
  if (!process.env.DELETER_API) {
    return console.error(
      'DELETER_API environment variable is missing. Please run yarn deploy:demo.'
    );
  }

  // Prepare signed upload request
  const resource = '/storage/delete';
  const api = url.parse(`https://${process.env.DELETER_API}`);
  const uri = `https://${process.env.DELETER_API}/${resource}`;
  const resourcePath = api.path + resource;

  try {
    const params = {
      uri,
      host: api.host,
      path: resourcePath,
      headers: {
        'x-amz-meta-computed-key': computedKey,
      },
    };

    const response = await request.get(aws4.sign(params, credentials));

    return console.log(JSON.parse(response).message);
  } catch (e) {
    return console.error(e);
  }
};

module.exports = upload;
