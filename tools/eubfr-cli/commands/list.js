const path = require('path');
const dotenv = require('dotenv');
const prettyjson = require('prettyjson');
const elasticsearch = require('elasticsearch');

const resolveSymbolicLink = require('../lib/resolveSymbolicLink');

const loc = resolveSymbolicLink('node_modules/@eubfr/demo-dashboard-client');

// Get environment variables from @eubfr/demo-dashboard-client
dotenv.config({ path: path.resolve(loc, '.env') });

const list = async ({ file, producer }) => {
  const index = `${process.env.REACT_APP_STAGE}-meta`;
  const host = `https://${process.env.REACT_APP_ES_PRIVATE_ENDPOINT}`;

  const client = elasticsearch.Client({
    host,
    log: 'warning',
    apiVersion: '6.2',
  });

  try {
    const results = await client.search({
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
    });

    console.log(`Results for producer: ${producer}`);
    return console.log(prettyjson.render(results));
  } catch (e) {
    return console.error(e);
  }
};

module.exports = list;
