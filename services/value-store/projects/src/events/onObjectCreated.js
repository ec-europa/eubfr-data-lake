import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

import elasticsearch from 'elasticsearch';
import connectionClass from 'http-aws-es';

import MessengerFactory from '@eubfr/logger-messenger/src/lib/MessengerFactory';
import { STATUS } from '@eubfr/logger-messenger/src/lib/status';

// Helpers
import deleteProjects from '../lib/deleteProjects';
import saveToElasticSearch from '../lib/saveToElasticSearch';
// import saveToKinesis from '../lib/saveToKinesis';

export const handler = async (event, context, callback) => {
  const { API, INDEX, REGION, STAGE } = process.env;

  // Checks ensuring proper functioning of the function
  if (!API || !INDEX || !REGION || !STAGE) {
    return callback(
      new Error(
        'API, INDEX, REGION and STAGE environment variables are required!'
      )
    );
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
  const sns = new AWS.SNS();
  const s3 = new AWS.S3();
  const messenger = MessengerFactory.Create({ context });
  const clientElasticSearch = elasticsearch.Client({
    host: `https://${API}`,
    apiVersion: '6.0',
    connectionClass,
    index: INDEX,
  });

  // Organize at a single place for helper functions
  const clients = { clientElasticSearch, messenger, s3, sns };

  // Clear existing records
  await deleteProjects({
    client: clientElasticSearch,
    index: INDEX,
    key: s3record.s3.object.key,
  });

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
    // Get information about the harmonized file
    const fileData = await s3
      .headObject({
        Bucket: s3record.s3.bucket.name,
        Key: s3record.s3.object.key,
      })
      .promise();

    // Add it to the box of useful data.
    usefulData.fileData = fileData;

    // If the file is less than 15MB, handle it directly
    if (fileData.ContentLength <= 15000000) {
      await messenger.send({
        message: {
          computed_key: originalComputedKey,
          status_message: 'Start uploading to ElasticSearch',
          status_code: STATUS.PROGRESS,
        },
        to: ['logs'],
      });

      return await saveToElasticSearch({ clients, usefulData, handleError });
    }

    await messenger.send({
      message: {
        computed_key: originalComputedKey,
        status_message: 'Data is bigger than 15MB and will be streamed.',
        status_code: STATUS.PROGRESS,
      },
      to: ['logs'],
    });

    // return await saveToKinesis({ clients, usefulData, handleError });
    return callback(`Still to be implemented`);
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
