import https from 'https';

const getRequest = params =>
  new Promise((resolve, reject) => {
    const req = https.request(params, res => {
      let body = [];

      if (res.statusCode < 200 || res.statusCode >= 300) {
        reject(new Error(`statusCode=${res.statusCode}`));
      }

      res.on('data', chunk => {
        body.push(chunk);
      });

      res.on('end', () => {
        try {
          body = JSON.parse(Buffer.concat(body).toString());
        } catch (e) {
          reject(e);
        }

        resolve(body);
      });
    });

    req.on('error', err => reject(err));

    req.end();
  });

export default getRequest;
