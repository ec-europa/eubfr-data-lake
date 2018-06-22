const fs = require('fs');
const url = require('url');
const path = require('path');
const aws4 = require('aws4');
const request = require('request-promise-native');

const getCredentials = require('../lib/getProducerCredentials');

/**
 * Upload a file to a specific S3 bucket.
 *
 * @param {String} producer
 *   The name/key of a given producer, i.e 'agri', 'budg', etc.
 *   Defaults to 'agri'
 * @param {String} file
 *   The file a producer wants to upload to his S3 bucket to start the ingestion.
 *   Defaults to 'agri_history.csv'
 */
const uploadFile = async (producer = 'agri', file = 'agri_history.csv') => {
  const credentials = getCredentials(producer);

  process.env.SIGNED_UPLOADS_API =
    '5p86kr6l77.execute-api.eu-central-1.amazonaws.com/kc176a';

  // Get producer's credentials.
  const accessKeyId =
    credentials.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey =
    credentials.AWS_SECRET_ACCESS_KEY || process.env.PRODUCER_SECRET_ACCESS_KEY;

  // Prepare signed upload request
  const resource = '/storage/signed_url';
  const api = url.parse(`https://${process.env.SIGNED_UPLOADS_API}`);
  const uri = `https://${process.env.SIGNED_UPLOADS_API}/${resource}`;
  const resourcePath = api.path + resource;
  const headers = {
    'x-amz-meta-producer-key': file,
  };

  try {
    // Get the signed URL
    const signParameters = {
      uri,
      headers,
      path: resourcePath,
      host: api.host,
    };

    const signedUrl = await request.get(
      aws4.sign(signParameters, {
        accessKeyId,
        secretAccessKey,
      })
    );

    // Upload the file based on the signed URL
    request.put({
      // Removing double quotes to build a correct path.
      uri: signedUrl.replace(/["]+/g, ''),
      body: fs.readFileSync(path.resolve(file)),
    });
  } catch (e) {
    console.error(e);
  }
};

module.exports = uploadFile;
