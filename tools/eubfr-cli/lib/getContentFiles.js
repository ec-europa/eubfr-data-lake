const AWS = require('aws-sdk');

/**
 * Utility to sync an S3 content repository to a local file system.
 */
const getContentFiles = async ({ folder, producer }) => {
  // This presence of a value in this variable is assured by the top-level command.
  const { EUBFR_CONTENT_REPOSITORY: repo } = process.env;

  const s3 = new AWS.S3();
  const files = await s3.listObjects({ Bucket: repo }).promise();

  console.log({ folder, producer });
  console.log(files);
};

module.exports = getContentFiles;
