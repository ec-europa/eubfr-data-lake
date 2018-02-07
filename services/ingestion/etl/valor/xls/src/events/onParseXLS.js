import path from 'path';
import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import XLSX from 'xlsx';

import MessengerFactory from '@eubfr/logger-messenger/src/lib/MessengerFactory';
import { STATUS } from '@eubfr/logger-messenger/src/lib/status';

import transformRecord from '../lib/transform';

export const handler = async (event, context, callback) => {
  /*
   * Some checks here before going any further
   */

  // Only work on the first record
  const snsRecord = event.Records ? event.Records[0] : undefined;

  // Was the lambda triggered correctly? Is the file extension supported? etc.
  if (!snsRecord || snsRecord.EventSource !== 'aws:sns') {
    throw new Error('Bad record');
  }

  /*
   * Prepare file analysis
   */

  // Extract message
  const message = JSON.parse(snsRecord.Sns.Message);

  // Check file extension
  if (['.xls', '.xlsx'].indexOf(path.extname(message.object.key)) === -1) {
    return callback(new Error('File extension should be .xls or .xlsx'));
  }

  // Get environment variables
  const { BUCKET } = process.env;

  const messenger = MessengerFactory.Create({ context });

  const handleError = async e => {
    await messenger.send({
      message: {
        computed_key: message.object.key,
        status_message: e.message,
        status_code: STATUS.ERROR,
      },
      to: ['logs'],
    });

    return callback(e);
  };

  const s3 = new AWS.S3();

  await messenger.send({
    message: {
      computed_key: message.object.key,
      status_message: 'Start parsing XLS...',
      status_code: STATUS.PARSING,
    },
    to: ['logs'],
  });

  // Get file
  const file = s3
    .getObject({
      Bucket: message.bucket.name,
      Key: message.object.key,
    })
    .createReadStream();

  // Put data in buffer
  const buffers = [];
  file.on('data', data => {
    buffers.push(data);
  });

  file.on('error', handleError);

  // Manage data
  file.on('end', () => {
    let dataString = '';

    try {
      // Parse file
      const buffer = Buffer.concat(buffers);
      const workbook = XLSX.read(buffer);
      const sheetNameList = workbook.SheetNames;
      const parser = XLSX.utils.sheet_to_json(
        workbook.Sheets[sheetNameList[0]]
      );

      for (let i = 0; i < parser.length; i += 1) {
        // Transform data
        const data = transformRecord(parser[i]);
        dataString += `${JSON.stringify(data)}\n`;
      }
    } catch (e) {
      return handleError(e);
    }

    // Load data
    const params = {
      Bucket: BUCKET,
      Key: `${message.object.key}.ndjson`,
      Body: dataString,
      ContentType: 'application/x-ndjson',
    };

    return s3.upload(params, async err => {
      if (err) {
        return handleError(err);
      }

      await messenger.send({
        message: {
          computed_key: message.object.key,
          status_message:
            'XLS parsed successfully. Results will be uploaded to ElasticSearch soon...',
          status_code: STATUS.PARSED,
        },
        to: ['logs'],
      });

      return callback(null, 'XLS parsed successfully');
    });
  });

  return file;
};

export default handler;
