const fs = require('fs');
const url = require('url');
const path = require('path');
const aws4 = require('aws4');
const request = require('request-promise-native');

const getProducerFiles = require('../../lib/getProducerFiles');

const uploadFile = async ({ file, creds, requestParams }) => {
  const fileName = path.parse(file).base;

  try {
    // Get the signed URL
    const params = {
      uri: requestParams.uri,
      host: requestParams.api.host,
      path: requestParams.resourcePath,
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

/**
 * Upload files.
 *
 * @param {Array} files
 *   The files to upload.
 * @param {Array} credentials
 *   List of credentials for the producers.
 */
const contentUploadCommand = ({ files, credentials, endpoints }) => {
  // Prepare signed upload request
  const resource = 'storage/signed_url';
  const api = url.parse(`https://${endpoints.SIGNED_UPLOADS_API}`);
  const uri = `https://${endpoints.SIGNED_UPLOADS_API}/${resource}`;
  const resourcePath = `${api.path}/${resource}`;

  const requestParams = { uri, api, resourcePath };

  return Promise.all(
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
          const filePath = userSpecifiedFiles
            ? ''
            : `.content/${producerName}/`;

          return uploadFile({ file: filePath + file, creds, requestParams });
        })
      );
    })
  );
};

module.exports = contentUploadCommand;
