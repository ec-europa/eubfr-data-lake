/* eslint-disable import/prefer-default-export, no-console */
import { saveProject } from '@eubfr/dynamodb-helpers/save';

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

  /*
   * Configure the parser
   */
  const parser = parse({ columns: true });
  const dynamo = new AWS.DynamoDB();

  parser.on('readable', () => {
    let record;
    // eslint-disable-next-line
    while ((record = parser.read())) {
      /*
       * Transform message
       */

      /*
       * Map fields
       */

      // Preprocess timeframe
      let timeframeFrom = null;
      let timeframeTo = null;

      if (record['Timeframe start'].indexOf(' to ') !== -1) {
        const timeframe = (record['Timeframe start'] || '').split(' to ');

        if (Array.isArray(timeframe) && timeframe.length === 2) {
          [timeframeFrom, timeframeTo] = timeframe;
        }
      } else {
        timeframeFrom = record['Timeframe start'];
        timeframeTo = record['Timeframe end'];
      }

      // Preprocess related links
      const links = (record['Related links'] || '')
        .split(';')
        .map(link => {
          const matches = link.match(/<a .*href="(.*)".*>(.*)<\/a>/i);

          if (Array.isArray(matches) && matches.length === 3) {
            return {
              url: matches[1],
              label: matches[2],
            };
          }

          return null;
        })
        .filter(link => link !== null);

      // Preprocess project locations
      const latArray = record['Project location latitude'].split(';');
      const longArray = record['Project location longitude'].split(';');
      const projectLocations = record['Project country(ies)']
        .split(';')
        .map((country, index) => ({
          name: country,
          geolocation: {
            lat: (Array.isArray(latArray) && latArray[index]) || null,
            long: (Array.isArray(longArray) && longArray[index]) || null,
          },
        }));

      // Map the fields
      const data = {
        creation_date: message.eventTime, // already ISO-8601
        source: {
          producer: message.userIdentity.principalId,
          object_key: message.object.key,
        },
        title: record.Name,
        cover_image: record.Visual,
        programme_name: record['Programme name'],
        description: record['Project description'],
        results: record.Results,
        ec_priorities: record['EC’s priorities'].split(';'),
        coordinators: record.Coordinators.split(';'),
        eu_budget_contribution: record['EU Budget contribution'],
        partners: record.Partners.split(';'),
        project_locations: projectLocations,
        timeframe: {
          from:
            timeframeFrom &&
            new Date(parseInt(timeframeFrom, 10) * 1000).toISOString(),
          to:
            timeframeTo &&
            new Date(parseInt(timeframeTo, 10) * 1000).toISOString(),
        },
        project_website: record['Project webpage'],
        related_links: links,
      };

      /*
       * Save to DB
       */

      saveProject(dynamo, process.env.TABLE, data, err => {
        if (err) {
          console.log(err);
        }
      });
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
  const s3 = new AWS.S3();

  return s3
    .getObject({
      Bucket: message.bucket.name,
      Key: message.object.key,
    })
    .createReadStream()
    .pipe(parser);
};
