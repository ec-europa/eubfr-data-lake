const fs = require('fs');
const url = require('url');
const path = require('path');

const aws4 = require('aws4');
const dotenv = require('dotenv');
const request = require('request-promise-native');

const getServiceLocation = require('../lib/getServiceLocation');
const getProducerFiles = require('../lib/getProducerFiles');

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
    console.error(
      "SIGNED_UPLOADS_API environment variable is missing. Please redeploy by running 'yarn deploy' from project root or run 'npx serverless export-env' in @eubfr/storage-signed-uploads service if you have already deployed your infrastructure, but don't have the necessary .env files."
    );
    process.exit(1);
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

      console.time(`${fileName} has been uploaded`);

      await request.put({
        // Removing double quotes to build a correct path.
        uri: signedUrl.replace(/["]+/g, ''),
        body: fs.readFileSync(path.resolve(file)),
      });

      return console.timeEnd(`${fileName} has been uploaded`);
    } catch (e) {
      return console.error(
        `Upload of ${fileName} failed with ${e.statusCode} code.`
      );
    }
  };

  credentials.map(producer => {
    const producerName = Object.keys(producer)[0];
    const creds = producer[producerName];
    const userSpecifiedFiles = files.length > 0;
    // If files are provided by the user - use them
    // Otherwise take all local files
    const filesToUpload = userSpecifiedFiles
      ? files
      : getProducerFiles(producerName);

    return Promise.all(
      filesToUpload.map(async file => {
        // If user has specified files, we know the path
        // But if not user specified, we need to tweak for local setup
        const filePath = userSpecifiedFiles ? '' : `.content/${producerName}/`;

        return uploadFile({ file: filePath + file, creds });
      })
    );
  });
};

module.exports = uploadCommand;
