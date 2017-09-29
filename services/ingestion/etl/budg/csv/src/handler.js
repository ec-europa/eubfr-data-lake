/* eslint-disable import/prefer-default-export, no-console */
import path from 'path';
import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import parse from 'csv-parse';
import uuid from 'uuid';

import transform from './transform';

const onParseError = err => {
  console.error(err.message);
};

const onSaveError = err => {
  console.error(err);
};

const onParseFinish = () => {
  console.info('Finished parsing');
};

export const parseCsv = (event, context, callback) => {
  /*
   * Some checks here before going any further
   */

  // Only work on the first record
  const snsRecord = event.Records[0];

  // Was the lambda triggered correctly? Is the file extension supported? etc.
  if (!snsRecord || snsRecord.EventSource !== 'aws:sns') {
    return callback('Bad record');
  }

  /*
   * Prepare file analysis
   */

  // Extract message
  const message = JSON.parse(snsRecord.Sns.Message);

  // Check file extension
  if (path.extname(message.object.key) !== '.csv') {
    return callback('File extension should be .csv');
  }

  /*
   * Configure the parser
   */
  const parser = parse({ columns: true });
  const documentClient = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10',
    convertEmptyValues: true,
  });

  parser.on('readable', () => {
    let record;

    /*
     * Extract
     */
    // eslint-disable-next-line
    while ((record = parser.read())) {
      /*
       * Transform message
       */
      const data = transform(record);

      /*
       * Load
       */
      const params = {
        TableName: process.env.TABLE,
        Item: {
          computed_key: message.object.key,
          part_id: record.Nid || uuid.v1(),
          creation_date: message.eventTime, // already ISO-8601
          producer: message.userIdentity.principalId,
          data,
        },
      };

      documentClient.put(params, err => {
        if (err) {
          if (err) {
            onSaveError(err);
          }
        }
      });
    }
  });

  parser.on('error', onParseError);
  parser.on('finish', onParseFinish);

  /*
   * Start the hard work
   */
  const s3 = new AWS.S3();

  return s3
    .getObject({
      Bucket: message.bucket.name,
      Key: message.object.key,
    })
    .createReadStream()
    .pipe(parser);
};
