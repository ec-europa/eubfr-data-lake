import AWS from 'aws-sdk-mock';

import { promisify } from 'util';
import onObjectRemoved from '../../../src/events/onObjectRemoved';

// Add stubs
import eventEubfr from '../../stubs/events/onObjectRemoved/event-eubfr.json';

const handler = promisify(onObjectRemoved);

describe(`Function onObjectRemoved in "@eubfr/ingestion-cleaner" when S3 service works well`, () => {
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
    process.env.BUCKET = 'foo';
    const event = eventEubfr;
    const context = {};

    const result = handler(event, context);
    expect.assertions(1);
    return expect(result).resolves.toBe(`object removed`);
  });
});

describe(`Function onObjectRemoved in "@eubfr/ingestion-cleaner" when S3 service fails`, () => {
  beforeAll(() => {
    AWS.mock('S3', 'deleteObject', (params, callback) => {
      callback('S3 failure');
    });
  });

  afterEach(() => {
    // ensure that the environment is not left over a test
    delete process.env.BUCKET;
  });

  afterAll(() => {
    AWS.restore('S3', 'deleteObject');
  });

  test('The function fails to remove an object from S3 because of service failure', () => {
    process.env.BUCKET = 'foo';
    const event = eventEubfr;
    const context = {};

    expect.assertions(1);
    const result = handler(event, context);
    return expect(result).rejects.toBe(`S3 failure`);
  });
});
