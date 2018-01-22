import path from 'path';
import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

import Logger from '../../../../../../logger/listener/src/lib/Logger';
import transformRecord from '../lib/transform';
import { STATUS } from '../../../../../../storage/meta-index/src/lib/status';

// Destination bucket
const { BUCKET } = process.env;

export const handler = async (event, context, callback) => {
  /*
   * Some checks here before going any further
   */

  // Only work on the first record
  const snsRecord = event.Records ? event.Records[0] : undefined;

  // Was the lambda triggered correctly? Is the file extension supported? etc.
  if (
    !snsRecord ||
    snsRecord.EventSource !== 'aws:sns' ||
    !snsRecord.Sns ||
    !snsRecord.Sns.Message
  ) {
    return callback(Error('Bad record'));
  }

  /*
   * Prepare file analysis
   */

  // Extract message
  let message = {};
  try {
    message = JSON.parse(snsRecord.Sns.Message);
  } catch (e) {
    return callback(e);
  }

  if (!message.object || !message.object.key) {
    return callback(Error('The message is not valid'));
  }

  // Check file extension
  if (path.extname(message.object.key) !== '.json') {
    return callback(Error('File extension should be .json'));
  }

  /*
   * Prepare the SNS message
   */

  // Get Account ID from lambda function arn in the context
  const accountId = context.invokedFunctionArn.split(':')[4];

  // Extract env vars
  const { REGION, STAGE } = process.env;

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
            message: e,
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
      status_message: 'Start parsing JSON...',
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
  return file.on('end', () => {
    let dataString = '';

    try {
      // Parse file
      const buffer = Buffer.concat(buffers);
      let parser = JSON.parse(buffer);

      // Sometimes records are nested in items key.
      parser = parser.items ? parser.items : parser;

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
            'JSON parsed successfully. Results will be uploaded to ElasticSearch soon...',
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

          return callback(null, 'JSON file has been parsed');
        }
      );
    });
  });
};

export default handler;
