const prettyjson = require('prettyjson');

/**
 * Shows a list of available domains
 */
const showDomains = () => {
  const domains = [
    {
      'dev-public':
        'https://search-dev-public-g7cnsnvyupyfaccjhtcdr23jai.eu-central-1.es.amazonaws.com',
    },
    {
      'dev-private':
        'https://search-dev-private-qbomdhbnodbkxk2233gh3lvruu.eu-central-1.es.amazonaws.com',
    },
  ];

  return console.log(prettyjson.render(domains));
};

module.exports = showDomains;
