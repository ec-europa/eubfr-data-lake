import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import XLSX from 'xlsx';

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

    if (
      !ensureExtensions({ file: key, extensions: ['.xls', '.xlsx', '.xlsm'] })
    ) {
      throw new Error('XLS, XLSX or XLSM file expected for this ETL.');
    }

    const messenger = MessengerFactory.Create({ context });
    const s3 = new AWS.S3();

    await messenger.send({
      message: {
        computed_key: key,
        status_message: 'Start parsing XLS...',
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
        let uploadData = '';
        const projects = [];
        const useful = ['Core Indicators', 'Agregated Indicaters'];
        const buffer = Buffer.concat(buffers);
        const workbook = XLSX.read(buffer);
        const sheets = workbook.SheetNames;

        sheets.forEach(sheet => {
          const records = [];
          const ws = workbook.Sheets[sheet];
          const rows = XLSX.utils.sheet_to_json(ws);

          if (useful.includes(sheet) && rows.length) {
            const header = rows.shift();

            rows.forEach(row => {
              const record = {};

              Object.keys(row).forEach(field => {
                const improvedField = header[field].replace(
                  /(\r\n|\n|\r)/gm,
                  ' '
                );
                record[improvedField] = row[field];
              });

              records.push(record);
            });

            projects.push(records);
          }
        });

        // At this point we have a two-dimensional array with records from two sheets.
        const p1 = projects.pop();
        const p2 = projects.pop();

        p1.forEach((p1project, i) => {
          const merged = Object.assign({}, p1project, p2[i]);
          projects.push(merged);
        });

        // At this point, `projects` is a one-dimensional array with records merging information from the 2 sheets we are interested in.

        // Apply specific transformations for this ETL.
        projects.forEach(project => {
          const data = transformRecord(project);
          uploadData += `${JSON.stringify(data)}\n`;
        });

        // Load data
        const params = {
          Bucket: BUCKET,
          Key: `${key}.ndjson`,
          Body: uploadData,
          ContentType: 'application/x-ndjson',
        };

        await s3.upload(params).promise();

        await messenger.send({
          message: {
            computed_key: key,
            status_message:
              'XLS parsed successfully. Results will be uploaded to ElasticSearch soon...',
            status_code: STATUS.PARSED,
          },
          to: ['logs'],
        });

        return resolve('XLS parsed successfully');
      });
    });
  } catch (e) {
    throw e;
  }
};

export default handler;
