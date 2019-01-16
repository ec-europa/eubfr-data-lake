import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import xml2js from 'xml2js';

// ETL utilities.
import ensureExtensions from '@eubfr/lib/etl/ensureExtensions';
import extractMessage from '@eubfr/lib/etl/extractMessage';
import handleError from '@eubfr/lib/etl/handleError';

import MessengerFactory from '@eubfr/logger-messenger/src/lib/MessengerFactory';
import { STATUS } from '@eubfr/logger-messenger/src/lib/status';

import transformRecord from '../lib/transform';

export const handler = async (event, context) => {
  const { BUCKET, REGION, STAGE } = process.env;

  if (!BUCKET || !REGION || !STAGE) {
    throw new Error(
      'BUCKET, REGION and STAGE environment variables are required!'
    );
  }

  try {
    const snsMessage = extractMessage(event);
    const { key } = snsMessage.object;

    if (!ensureExtensions({ file: key, extensions: ['.xml'] })) {
      throw new Error('XML file expected for this ETL.');
    }

    const s3 = new AWS.S3();
    const messenger = MessengerFactory.Create({ context });

    await messenger.send({
      message: {
        computed_key: key,
        status_message: 'Start parsing XML...',
        status_code: STATUS.PARSING,
      },
      to: ['logs'],
    });

    // Get file
    const readStream = s3
      .getObject({ Bucket: snsMessage.bucket.name, Key: key })
      .createReadStream();

    return new Promise((resolve, reject) => {
      // Put data in buffer
      const buffers = [];
      readStream.on('data', data => {
        buffers.push(data);
      });

      readStream.on('error', async e =>
        handleError(
          { messenger, key, statusCode: STATUS.ERROR },
          { error: e, callback: reject }
        )
      );

      // Manage data
      readStream.on('end', async () => {
        let dataString = '';

        try {
          // Parse file
          const buffer = Buffer.concat(buffers);

          const parser = xml2js.Parser();
          parser.parseString(buffer, (err, result) => {
            if (result.main && result.main.DATA_RECORD) {
              const res = result.main.DATA_RECORD;
              for (let i = 0; i < res.length; i += 1) {
                // Transform data
                const data = transformRecord(res[i]);
                dataString += `${JSON.stringify(data)}\n`;
              }
            }
          });
        } catch (e) {
          return handleError(e, reject);
        }

        // Load data
        const params = {
          Bucket: BUCKET,
          Key: `${key}.ndjson`,
          Body: dataString,
          ContentType: 'application/x-ndjson',
        };

        await s3.upload(params).promise();

        await messenger.send({
          message: {
            computed_key: key,
            status_message:
              'XML parsed successfully. Results will be uploaded to ElasticSearch soon...',
            status_code: STATUS.PARSED,
          },
          to: ['logs'],
        });

        return resolve('XML parsed successfully');
      });
    });
  } catch (e) {
    throw e;
  }
};

export default handler;
