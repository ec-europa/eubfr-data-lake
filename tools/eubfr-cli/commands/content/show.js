const prettyjson = require('prettyjson');
const elasticsearch = require('elasticsearch');

/**
 * List file(s) of a given producer.
 *
 * @param {String} file
 *   The specific file to view. Optional, all items are shown by default.
 * @param {String} producer
 *   The producer's name. For example: 'cordis', 'eac', etc.
 */
const showCommand = async ({ file, producer, endpoints }) => {
  const index = `${endpoints.REACT_APP_STAGE}-meta`;
  const host = `https://${endpoints.REACT_APP_ES_PRIVATE_ENDPOINT}`;

  const query = {
    index,
    type: 'file',
  };

  const client = elasticsearch.Client({
    host,
    log: 'warning',
    apiVersion: '6.3',
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
