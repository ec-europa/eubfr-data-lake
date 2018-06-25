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
  let query = '';
  const index = `${process.env.REACT_APP_STAGE}-meta`;
  const host = `https://${process.env.REACT_APP_ES_PRIVATE_ENDPOINT}`;

  const client = elasticsearch.Client({
    host,
    log: 'warning',
    apiVersion: '6.2',
  });

  if (file) {
    // Show single file
    query = {
      index,
      type: 'file',
      q: `computed_key:"${file}"`,
    };
  } else {
    // Show all files
    query = {
      index,
      type: 'file',
      body: {
        query: {
          term: {
            producer_id: producer,
          },
        },
        sort: [{ last_modified: { order: 'desc' } }],
      },
    };
  }

  try {
    const results = await client.search(query);

    console.log(`Results for producer: ${producer}`);
    return console.log(prettyjson.render(results));
  } catch (e) {
    return console.error(e);
  }
};

module.exports = showCommand;
