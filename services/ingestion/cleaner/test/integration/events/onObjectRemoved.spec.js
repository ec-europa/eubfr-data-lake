import AWS from 'aws-sdk-mock';

import { promisify } from 'util';
import onObjectRemoved from '../../../src/events/onObjectRemoved';

// Add stubs
import eventEubfr from '../../stubs/events/onObjectRemoved/event-eubfr.json';

const handler = promisify(onObjectRemoved);

describe(`Function onObjectRemoved in "@eubfr/ingestion-cleaner"`, () => {
  beforeAll(() => {
    AWS.mock('S3', 'deleteObject', (params, callback) => {
      callback(null, 'Successfully deleted a file from the S3 storage');
    });
  });

  afterEach(() => {
    // ensure that the environment is not left over a test
    delete process.env.BUCKET;
  });

  afterAll(() => {
    AWS.restore('S3', 'deleteObject');
  });

  test('The function removes an object from S3 with the actual event stub', () => {
    const event = eventEubfr;
    const context = {};

    const result = handler(event, context);
    result.then(response => {
      // Either a null, error or a rejected promise because of bad input.
      expect(response).toBe(`object removed`);
    });
  });
});
