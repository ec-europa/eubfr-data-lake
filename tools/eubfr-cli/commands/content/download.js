const getContentFiles = require('../../lib/getContentFiles');

const contentDownloadCommand = async ({ folder, producer, override }) => {
  try {
    await getContentFiles({ folder, producer, override });
    return console.log('Files have been downloaded successfully.');
  } catch (error) {
    return console.error(error);
  }
};

module.exports = contentDownloadCommand;
