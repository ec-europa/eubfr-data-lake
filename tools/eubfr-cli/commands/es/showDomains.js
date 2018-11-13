const prettyjson = require('prettyjson');

/**
 * Shows a list of available domains
 */
const showDomains = endpoints => {
  // We want to share information only about these domains
  const domains = [
    'REACT_APP_ES_PUBLIC_ENDPOINT',
    'REACT_APP_ES_PRIVATE_ENDPOINT',
  ];

  const info = domains.map(key => ({ [key]: endpoints[key] }));

  return console.log(prettyjson.render(info));
};

module.exports = showDomains;
