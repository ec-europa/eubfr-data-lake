import path from 'path';
import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import XLSX from 'xlsx';
import transformRecord from '../lib/transform';

import Logger from '../../../../../../logger/listener/src/lib/Logger';

// Import constants
import { STATUS } from '../../../../../../storage/meta-index/src/events/onStatusReported';

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
    return callback('File extension should be .xls or .xlsx');
  }

  /*
   * Prepare the SNS message
   */

  // Get Account ID from lambda function arn in the context
  const accountId = context.invokedFunctionArn.split(':')[4];

  // Get environment variables
  const { BUCKET, REGION, STAGE } = process.env;

  // Get the endpoint arn
  const endpointArn = `arn:aws:sns:${REGION}:${accountId}:${STAGE}-MetaStatusReported`;
  const sns = new AWS.SNS();

  const logger = new Logger({
    sns,
    targetArn: `arn:aws:sns:${REGION}:${accountId}:${STAGE}-onLogEmitted`,
    emitter: context.invokedFunctionArn,
  });

  const handleError = e =>
    sns.publish(
      {
        Message: JSON.stringify({
          default: JSON.stringify({
            key: message.object.key,
            status: STATUS.ERROR,
            message: JSON.stringify(e),
          }),
        }),
        MessageStructure: 'json',
        TargetArn: endpointArn,
      },
      async snsErr => {
        if (snsErr) {
          return callback(snsErr);
        }

        await logger.error({
          message: {
            computed_key: message.object.key,
            status_message: JSON.stringify(e),
          },
        });

        return callback(e);
      }
    );

  const s3 = new AWS.S3();

  await logger.info({
    message: {
      computed_key: message.object.key,
      status_message: 'Start parsing XLS...',
    },
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
      return handleError(e.message);
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

      await logger.info({
        message: {
          computed_key: message.object.key,
          status_message:
            'XLS parsed successfully. Results will be uploaded to ElasticSearch soon...',
        },
      });

      /*
       * Send the SNS message
       */
      return sns.publish(
        {
          Message: JSON.stringify({
            default: JSON.stringify({
              key: message.object.key,
              status: STATUS.PARSED,
              message: 'ETL successful',
            }),
          }),
          MessageStructure: 'json',
          TargetArn: endpointArn,
        },
        snsErr => {
          if (snsErr) {
            return callback(snsErr);
          }

          return callback(null, 'XLS file has been parsed');
        }
      );
    });
  });

  return file;
};

export default handler;
