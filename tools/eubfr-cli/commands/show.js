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
  if (
    !process.env.REACT_APP_STAGE ||
    !process.env.REACT_APP_ES_PRIVATE_ENDPOINT
  ) {
    console.error(
      "REACT_APP_STAGE and REACT_APP_ES_PRIVATE_ENDPOINT environment variables are required. Please redeploy by running 'yarn deploy:demo' from project root or run 'npx serverless export-env' in @eubfr/demo-dashboard-client service if you have already deployed your infrastructure, but don't have the necessary .env files."
    );
    process.exit(1);
  }

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
    return new Error(e);
    // return new Error(
    //   'Show operation failed, please ensure correct parameters.'
    // );
  }
};

module.exports = showCommand;
