const fs = require('fs');
const url = require('url');
const path = require('path');

const aws4 = require('aws4');
const dotenv = require('dotenv');
const request = require('request-promise-native');

const getServiceLocation = require('../lib/getServiceLocation');
const getProducerFiles = require('../lib/getProducerFiles');

// Gets the credentials of the first item in the credentials array item
// Useful when the producer name is passed.
const extractCredentials = credentials => {
  let creds = '';

  credentials.forEach(producer => {
    const key = Object.keys(producer)[0];
    creds = producer[key];
  });

  return creds;
};

dotenv.config({
  path: path.resolve(getServiceLocation('storage-signed-uploads'), '.env'),
});

/**
 * Upload files.
 *
 * @param {Array} files
 *   The files to upload.
 * @param {Array} credentials
 *   List of credentials for the producers.
 */
const uploadCommand = ({ files, credentials }) => {
  if (!process.env.SIGNED_UPLOADS_API) {
    return console.error(
      "SIGNED_UPLOADS_API environment variable is missing. Please redeploy by running 'yarn deploy' from project root"
    );
  }

  // Prepare signed upload request
  const resource = 'storage/signed_url';
  const api = url.parse(`https://${process.env.SIGNED_UPLOADS_API}`);
  const uri = `https://${process.env.SIGNED_UPLOADS_API}/${resource}`;
  const resourcePath = `${api.path}/${resource}`;

  const uploadFile = async ({ file, creds }) => {
    const fileName = path.parse(file).base;

    try {
      // Get the signed URL
      const params = {
        uri,
        host: api.host,
        path: resourcePath,
        headers: {
          'x-amz-meta-producer-key': fileName,
        },
      };
      const signedUrl = await request.get(aws4.sign(params, creds));

      console.log(`Uploading ${fileName} ...`);
      return await request.put({
        // Removing double quotes to build a correct path.
        uri: signedUrl.replace(/["]+/g, ''),
        body: fs.readFileSync(path.resolve(file)),
      });
    } catch (e) {
      return console.error(e);
    }
  };

  // Producer-oriented upload
  if (files.length > 0) {
    const creds = extractCredentials(credentials);
    files.forEach(file => uploadFile({ file, creds }));
    process.exit(1);
  }

  // Mass upload
  return credentials.forEach(async producer => {
    const producerName = Object.keys(producer)[0];
    const creds = producer[producerName];
    const producerFiles = await getProducerFiles(producerName);

    console.log(`Uploading for producer: ${producerName}.`);
    producerFiles.forEach(file =>
      uploadFile({ file: `.content/${producerName}/${file}`, creds })
    );
  });
};

module.exports = uploadCommand;
