const fs = require('fs');
const url = require('url');
const path = require('path');

const aws4 = require('aws4');
const dotenv = require('dotenv');
const request = require('request-promise-native');

const getServiceLocation = require('../lib/getServiceLocation');

dotenv.config({
  path: path.resolve(getServiceLocation('storage-signed-uploads'), '.env'),
});

/**
 * Upload a file to a specific S3 bucket.
 *
 * @param {String} file
 *   The file a producer wants to upload to his S3 bucket to start the ingestion.
 * @param {Object} credentials
 *   The producer's credentials which define where the file will go.
 */
const upload = ({ files, credentials }) => {
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

  files.forEach(async file => {
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

      const signedUrl = await request.get(aws4.sign(params, credentials));

      // Upload the file based on the signed URL
      console.log(`Uploading ${fileName} ...`);
      return await request.put({
        // Removing double quotes to build a correct path.
        uri: signedUrl.replace(/["]+/g, ''),
        body: fs.readFileSync(path.resolve(file)),
      });
    } catch (e) {
      return console.error(e);
    }
  });
};

module.exports = upload;
