import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

import elasticsearch from 'elasticsearch';
import connectionClass from 'http-aws-es';

export const handler = (event, context, callback) => {
  // API to work with
  const { API } = process.env;

  const options = {
    host: `https://${API}`,
    connectionClass,
    log: 'trace',
    index: 'projects',
  };

  const client = elasticsearch.Client(options);

  client
    .info()
    .then(console.log)
    .catch(console.log);

  // Retrieve file meta
  return {};
};

export default handler;
