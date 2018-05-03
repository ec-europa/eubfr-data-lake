import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

import elasticsearch from 'elasticsearch';
import connectionClass from 'http-aws-es';
import split2 from 'split2';

import MessengerFactory from '@eubfr/logger-messenger/src/lib/MessengerFactory';
import { STATUS } from '@eubfr/logger-messenger/src/lib/status';

import deleteReports from '../lib/deleteReports';
import getAvailableProperties from '../lib/getAvailableProperties';
import getCoverageReport from '../lib/getCoverageReport';

export const handler = async (event, context, callback) => {
  const { API, INDEX, REGION, STAGE } = process.env;

  if (!API || !INDEX || !REGION || !STAGE) {
    return callback(
      new Error(
        'API, INDEX, REGION and STAGE environment variables are required!'
      )
    );
  }

  /*
   * Some checks here before going any further
   */
  if (!event.Records) {
    return callback(new Error('No record'));
  }

  // Only work on the first record
  const snsRecord = event.Records[0];

  // Was the lambda triggered correctly? Is the file extension supported? etc.
  if (!snsRecord || snsRecord.EventSource !== 'aws:sns') {
    return callback(new Error('Bad record'));
  }

  // Insantiate clients
  const client = elasticsearch.Client({
    host: `https://${API}`,
    apiVersion: '6.0',
    connectionClass,
    index: INDEX,
  });

  const messenger = MessengerFactory.Create({ context });
  const s3 = new AWS.S3();

  /*
   * Extract information from the event
   */

  // Extract S3 record
  const s3record = JSON.parse(snsRecord.Sns.Message).Records[0];

  // Get original computed key (without '.ndjson')
  const originalComputedKey = s3record.s3.object.key.replace('.ndjson', '');

  try {
    await messenger.send({
      message: {
        computed_key: originalComputedKey,
        status_message: 'Starting data analysis for the ingested file ...',
        status_code: STATUS.PROGRESS,
      },
      to: ['logs'],
    });

    await deleteReports({
      client,
      index: INDEX,
      key: s3record.s3.object.key,
    });

    const handleError = async (e, cb) => {
      await messenger.send({
        message: {
          computed_key: originalComputedKey,
          status_message: e.message,
          status_code: STATUS.ERROR,
        },
        to: ['logs'],
      });

      return cb(e);
    };

    const readStream = s3
      .getObject({
        Bucket: s3record.s3.bucket.name,
        Key: s3record.s3.object.key,
      })
      .createReadStream();

    return new Promise((resolve, reject) => {
      let numRecords = 0;
      const results = [];

      readStream
        .pipe(split2(JSON.parse))
        .on('error', async e => handleError(e, reject))
        .on('data', record => {
          // increment counter for the final reporting
          numRecords += 1;
          // Get information about record and storage information in results.
          getAvailableProperties(record, results);
        })
        .on('finish', async () => {
          const report = getCoverageReport(results, numRecords);
          console.log(report);

          await messenger.send({
            message: {
              computed_key: originalComputedKey,
              status_message: 'Data quality analysis is read!',
              status_code: STATUS.SUCCESS_ETL,
            },
            to: ['logs'],
          });

          return resolve('Data quality analysis is read!');
        });
    });
  } catch (err) {
    await messenger.send({
      message: {
        computed_key: originalComputedKey,
        status_message: err.message,
        status_code: STATUS.ERROR,
      },
      to: ['logs'],
    });

    return callback(err);
  }
};

export default handler;
