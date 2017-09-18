/* eslint-disable import/prefer-default-export, no-console */
const path = require('path');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const parse = require('csv-parse');

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

  const s3 = new AWS.S3();

  /*
   * Prepare message publishing
   */

  // Get Account ID from lambda function arn in the context
  const accountId = context.invokedFunctionArn.split(':')[4];

  // Get stage and region from environment variables
  const stage = process.env.STAGE;
  const region = process.env.REGION;

  // Get the arn
  const endpointArn = `arn:aws:sns:${region}:${accountId}:${stage}-db`;

  const sns = new AWS.SNS();

  /*
   * Configure the parser
   */
  const parser = parse({ columns: true });

  parser.on('readable', () => {
    let record;
    // eslint-disable-next-line
    while ((record = parser.read())) {
      /*
       * Transform message
       */

      /*
       * Prepare the SNS message
       */

      // Fill the payload
      const payload = {
        default: JSON.stringify({
          data: record,
        }),
      };

      /*
       * Send the SNS message
       */
      sns.publish(
        {
          Message: JSON.stringify(payload),
          MessageStructure: 'json',
          TargetArn: endpointArn,
        },
        snsError => {
          if (snsError) {
            console.log(snsError);
          }
        }
      );
    }
  });

  // Catch any error
  parser.on('error', err => {
    console.log(err.message);
  });

  // When we are done, test that the parsed output matched what expected
  parser.on('finish', () => {});

  /*
   * Start the hard work
   */

  return s3
    .getObject({
      Bucket: message.bucket.name,
      Key: message.object.key,
    })
    .createReadStream()
    .pipe(parser);
};
