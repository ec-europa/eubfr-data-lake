const path = require('path');
const dotenv = require('dotenv');
const prettyjson = require('prettyjson');
const elasticsearch = require('elasticsearch');

const getServiceLocation = require('../lib/getServiceLocation');

dotenv.config({
  path: path.resolve(getServiceLocation('demo-dashboard-client'), '.env'),
});

/**
 * List file(s) of a given producer.
 *
 * @param {String} file
 *   The specific file to view. Optional, all items are shown by default.
 * @param {String} producer
 *   The producer's name. For example: 'agri', 'budg', etc.
 */
const showCommand = async ({ file, producer }) => {
  const index = `${process.env.REACT_APP_STAGE}-meta`;
  const host = `https://${process.env.REACT_APP_ES_PRIVATE_ENDPOINT}`;
  const query = {
    index,
    type: 'file',
  };

  const client = elasticsearch.Client({
    host,
    log: 'warning',
    apiVersion: '6.2',
  });

  if (file) {
    // Show single file
    query.q = `computed_key:"${file}"`;
  } else {
    // Show all files
    query.body = {
      query: {
        term: {
          producer_id: producer,
        },
      },
      sort: [{ last_modified: { order: 'desc' } }],
    };
  }

  try {
    const response = await client.search(query);
    const results =
      response.hits && response.hits.hits
        ? response.hits.hits.map(result => result._source)
        : [];
    return console.log(prettyjson.render(results));
  } catch (e) {
    return console.error(e);
  }
};

module.exports = showCommand;
