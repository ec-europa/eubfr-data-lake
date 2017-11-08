import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

import elasticsearch from 'elasticsearch';
import connectionClass from 'http-aws-es';

export const handler = (event, context, callback) => {
  // API to work with
  const { API } = process.env;

  const options = {
    hosts: [API],
    connectionClass,
    log: 'trace',
    index: 'projects',
    // httpOptions: {}, // set httpOptions on aws-sdk's request. default to aws-sdk's config.httpOptions
  };

  const client = elasticsearch.Client(options);

  client.ping(
    {
      // ping usually has a 3000ms timeout
      requestTimeout: 1000,
    },
    error => {
      if (error) {
        console.trace(error);
      } else {
        console.log('All is well');
      }
    }
  );

  // Retrieve file meta
  return {};
};

export default handler;
