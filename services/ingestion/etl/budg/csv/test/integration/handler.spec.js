// import { execSync } from 'child_process';
import { exec } from 'child_process';
import { promisify } from 'util';

// import AWS from 'aws-sdk-mock';
import path from 'path';

const sh = promisify(exec);

describe(`DG BUDG parseCsv() lambda function`, () => {
  // beforeAll(() => {
  //   // Modify behavior of `aws-sdk`.
  //   AWS.mock('DynamoDB', 'putItem', (params, callback) => {
  //     callback(null, 'successfully put item in database');
  //   });
  // });

  // Testing for async errors using Promise.catch.
  test('tests error with promises', () => {
    const options = {
      // The root of the `@eubfr/ingestion-etl-budg-csv` service.
      cwd: path.resolve(`${__dirname}/../../`),
    };
    const cmd = `./node_modules/.bin/sls invoke local -f parseCsv --path test/files/event_sns.json`;

    return expect(sh(cmd, options)).rejects.toEqual({
      errorMessage: 'Unexpected token o in JSON at position 1',
      errorType: 'SyntaxError',
    });
  });

  // afterAll(() => {
  //   // Restore normal behavior of `aws-sdk`.
  //   AWS.restore('DynamoDB');
  // });
});
