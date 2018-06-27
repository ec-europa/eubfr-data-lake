const extractCredentials = ({ producerKey, credentials }) => {
  let creds = '';
  credentials.forEach(producerCredentials => {
    if (producerKey in producerCredentials) {
      creds = producerCredentials[producerKey];
    }
  });
  return creds;
};

module.exports = extractCredentials;
