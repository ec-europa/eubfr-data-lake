const AWS = require('aws-sdk');
const fs = require('fs');

/**
 * Utility to sync an S3 content repository to a local file system.
 */
const getContentFiles = async ({ folder, producer, override }) => {
  // This presence of a value in this variable is assured by the top-level command.
  const { EUBFR_CONTENT_REPOSITORY: repo } = process.env;

  const s3 = new AWS.S3();

  try {
    await s3.headBucket({ Bucket: repo }).promise();
  } catch (error) {
    if (error.code === 'NotFound') {
      console.log(`The S3 bucket "${repo}" does not exist.`);
      return console.log(
        'Please change with EUBFR_CONTENT_REPOSITORY environment variable.'
      );
    }
  }

  try {
    // Ensure the folder where we are going to place the files exists.
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }

    const results = await s3.listObjects({ Bucket: repo }).promise();
    let files = results.Contents;

    // If there's a preference for a specific producer, respect it.
    if (producer !== '*') {
      files = files.filter(file => file.Key.includes(producer));
    }

    return Promise.all(
      files.map(file => {
        return new Promise((resolve, reject) => {
          const target = file.Key;

          // Check whether the target object has an extension.
          // If it doesn't, then it's a folder.
          if (!target.match(/\.[0-9a-z]+$/i)) {
            // Ensure the folder existis.
            if (!fs.existsSync(`${folder}/${target}`)) {
              fs.mkdirSync(`${folder}/${target}`);
              // Nothing more to do if it's a folder.
            }
            return resolve();
          }

          const fileToDownload = `${folder}/${target}`;

          if (fs.existsSync(fileToDownload) && !override) {
            console.log(`Skipped: ${fileToDownload}`);
            return resolve();
          }

          console.log(`Downloading: ${fileToDownload}`);

          const localFile = fs.createWriteStream(fileToDownload);

          return s3
            .getObject({ Bucket: repo, Key: target })
            .createReadStream()
            .on('error', error => reject(error))
            .pipe(localFile)
            .on('close', () => {
              console.log(`Downloaded: ${fileToDownload}`);
              return resolve();
            });
        });
      })
    );
  } catch (error) {
    throw new Error('Issue while trying to download files.', error);
  }
};

module.exports = getContentFiles;
