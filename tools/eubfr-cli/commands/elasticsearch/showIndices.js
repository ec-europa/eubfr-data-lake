const prettyjson = require('prettyjson');

/**
 * Shows a list of available indices
 */
const showIndices = (endpoints, domain) => {
  // We want to share information only about these domains
  const domains = ['ES_PUBLIC_ENDPOINT', 'ES_PRIVATE_ENDPOINT'];

  if (domain) {
    console.log(endpoints[domain]);
  } else {
    console.log(`Show information about all domains and indices`);
  }

  return console.log(prettyjson.render({}));
};

module.exports = showIndices;
