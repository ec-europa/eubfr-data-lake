import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

import MessengerFactory from '@eubfr/logger-messenger/src/lib/MessengerFactory';
import { STATUS } from '@eubfr/logger-messenger/src/lib/status';

// Helpers
import saveToKinesis from '../lib/kinesis/saveStream';

export const handler = async (event, context, callback) => {
  const { API, INDEX, REGION, STAGE, KINESIS_STREAM, BATCH_SIZE } = process.env;

  // Checks ensuring proper functioning of the function
  if (!API || !INDEX || !REGION || !STAGE || !KINESIS_STREAM || !BATCH_SIZE) {
    return callback(new Error('Missing environment variables!'));
  }
  if (!event.Records) {
    return callback(new Error('No record'));
  }
  // Only work on the first record
  const snsRecord = event.Records[0];
  // Was the lambda triggered correctly? Is the file extension supported? etc.
  if (!snsRecord || snsRecord.EventSource !== 'aws:sns') {
    return callback(new Error('Bad record'));
  }

  // Get keys
  const accountId = context.invokedFunctionArn.split(':')[4];
  const s3record = JSON.parse(snsRecord.Sns.Message).Records[0];
  const originalComputedKey = s3record.s3.object.key.replace('.ndjson', '');

  // Organize at a single place for helper functions
  const usefulData = {
    accountId,
    originalComputedKey,
    s3record,
    env: process.env,
  };

  // Clients
  const s3 = new AWS.S3();
  const messenger = MessengerFactory.Create({ context });

  // Organize at a single place for helper functions
  const clients = { messenger, s3 };

  // Define error handler
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

  try {
    await messenger.send({
      message: {
        computed_key: originalComputedKey,
        status_message: 'Starting ingestion of data ...',
        status_code: STATUS.PROGRESS,
      },
      to: ['logs'],
    });

    return await saveToKinesis({ clients, usefulData, handleError });
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
