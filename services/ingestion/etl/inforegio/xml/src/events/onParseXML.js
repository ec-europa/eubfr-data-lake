import path from 'path';
import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import Logger from '@eubfr/logger-listener/src/lib/Logger';

import transformRecord from '../lib/transform';
import { STATUS } from '../../../../../../storage/meta-index/src/lib/status';

const xml2js = require('xml2js');

// Destination bucket
const { BUCKET } = process.env;

export const handler = async (event, context, callback) => {
  // Extract env vars
  const { REGION, STAGE } = process.env;

  if (!REGION || !STAGE) {
    callback(`REGION and STAGE environment variable are required!`);
  }

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
  if (path.extname(message.object.key) !== '.xml') {
    return callback('File extension should be .xml');
  }

  /*
   * Prepare the SNS message
   */

  // Get Account ID from lambda function arn in the context
  const accountId = context.invokedFunctionArn.split(':')[4];

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
      status_message: 'Start parsing XML...',
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
            'XML parsed successfully. Results will be uploaded to ElasticSearch soon...',
        },
      });

      // Publish message to ETL Success topic

      /*
       * Send the SNS message
       */
      return sns.publish(
        {
          Message: JSON.stringify({
            default: JSON.stringify({
              key: message.object.key,
              status: STATUS.PARSED,
              message:
                'ETL successfully uploaded a parsed (harmonized) version of incoming data!',
            }),
          }),
          MessageStructure: 'json',
          TargetArn: endpointArn,
        },
        snsErr => {
          if (snsErr) {
            return callback(snsErr);
          }

          return callback(null, 'XML file has been parsed');
        }
      );
    });
  });

  return file;
};

export default handler;
