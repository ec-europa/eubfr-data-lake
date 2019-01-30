const getContentFiles = require('../../lib/getContentFiles');

const contentDownloadCommand = async ({ folder, producer }) => {
  try {
    await getContentFiles({ folder, producer });
    return console.log('Files have been downloaded successfully.');
  } catch (error) {
    return console.error(error);
  }
};

module.exports = contentDownloadCommand;
