const http = require('http');

export const handler = (event, context, callback) => {
  /**
   * Enrichment logic starts here
   */
  http
    .get(
      {
        hostname: 'europa.eu',
        port: 80,
        path: '/webtools/rest/gisco/api?q=berlin',
        headers: {
          'User-Agent': 'eubfr',
        },
      },
      res => {
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', chunk => {
          rawData += chunk;
        });

        res.on('end', () => {
          try {
            console.log(rawData);
          } catch (e) {
            console.error(e.message);
          }
        });

        callback(null, event);
      }
    )
    .on('error', e => {
      console.error(`Got error: ${e.message}`);
      callback(e);
    });
};

export default handler;
