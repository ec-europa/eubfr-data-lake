import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import parse from 'csv-parse/lib/sync';

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

  const snsMessage = extractMessage(event);
  const { key } = snsMessage.object;

  if (!ensureExtensions({ file: key, extensions: ['.csv'] })) {
    throw new Error('CSV file expected for this ETL.');
  }

  const messenger = MessengerFactory.Create({ context });
  const s3 = new AWS.S3();

  try {
    await messenger.send({
      message: {
        computed_key: key,
        status_message: 'Start parsing CSV...',
        status_code: STATUS.PARSING,
      },
      to: ['logs'],
    });

    let projects = '';
    const recordsAgg = [];
    const separator = ';';
    const mergeFields = [
      'Beneficiary name',
      'Beneficiary role',
      'Location indicator',
      'Country',
      // Not used, but maybe will be some day.
      'Total eligible expenditure allocated to the beneficiary',
      'Total Union co-financing allocated to the beneficiary',
    ];

    const file = await s3
      .getObject({ Bucket: snsMessage.bucket.name, Key: key })
      .promise();

    const csvData = file.Body.toString();
    const records = parse(csvData, { columns: true, delimiter: ';' });

    records.forEach(record => {
      const indexExisting = recordsAgg.findIndex(
        needle => needle['Operation name'] === record['Operation name']
      );

      // If not present yet.
      if (indexExisting === -1) {
        recordsAgg.push(record);
      }
      // If there's an existing object with that name, we have to update it.
      else {
        const existing = recordsAgg.splice(indexExisting, 1)[0];

        mergeFields.forEach(field => {
          // Concatenate old and current values for the given field.
          existing[field] = `${existing[field]}${separator}${record[field]}`;
        });

        recordsAgg.push(existing);
      }
    });

    recordsAgg.forEach(record => {
      const data = transformRecord(record);
      projects += `${JSON.stringify(data)}\n`;
    });

    // Upload the data to the harmonized storage bucket.
    const params = {
      Bucket: BUCKET,
      Key: `${key}.ndjson`,
      Body: projects,
      ContentType: 'application/x-ndjson',
    };

    await s3.upload(params).promise();

    await messenger.send({
      message: {
        computed_key: key,
        status_message:
          'CSV parsed successfully. Results will be uploaded to ElasticSearch soon...',
        status_code: STATUS.PARSED,
      },
      to: ['logs'],
    });

    return console.log('Done');
  } catch (error) {
    return handleError({ messenger, key, statusCode: STATUS.ERROR }, { error });
  }
};

export default handler;
