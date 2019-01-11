/**
 * @jest-environment node
 */

import AWS from 'aws-sdk-mock';
import AWS_SDK from 'aws-sdk';

import { promisify } from 'util';
import onObjectRemoved from '../../../src/events/onObjectRemoved';

// Add stubs
import eventOfficial from '../../stubs/events/onObjectRemoved/event-official.json';
import eventEubfr from '../../stubs/events/onObjectRemoved/event-eubfr.json';

// Explicitly set the correct module, as it might not map correctly after transpilation.
AWS.setSDKInstance(AWS_SDK);

describe(`Function onObjectRemoved in "@eubfr/ingestion-cleaner"`, () => {
  afterEach(() => {
    // ensure that the environment is not left over a test
    delete process.env.BUCKET;
  });

  test('The function requires a BUCKET environment variable', async () => {
    // Intentionally remove the environment variable to test the requirement.
    delete process.env.BUCKET;
    const event = {};
    const context = {};

    try {
      await onObjectRemoved(event, context);
    } catch (error) {
      expect(error.message).toEqual('BUCKET environment variable is required');
    }

    expect.assertions(1);
  });

  test('The function expects SNS record with the official event stub', async () => {
    process.env.BUCKET = 'foo';
    const event = eventOfficial;
    const context = {};

    try {
      await onObjectRemoved(event, context);
    } catch (error) {
      expect(error.message).toEqual('Bad record');
    }

    expect.assertions(1);
  });

  test('The function expects a message body from the actual event stub', async () => {
    process.env.BUCKET = 'foo';
    // Deep clone
    const copy = JSON.parse(JSON.stringify(eventEubfr));

    // Remove the message from the actual event to check that the function asserts it.
    delete copy.Records[0].Sns.Message;

    const context = {};

    try {
      await onObjectRemoved(copy, context);
    } catch (error) {
      expect(error.message).toEqual('Missing message body');
    }

    expect.assertions(1);
  });
});

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

  test('The function removes an object from S3 with the actual event stub', async () => {
    process.env.BUCKET = 'foo';
    const event = eventEubfr;

    const result = await onObjectRemoved(event);
    expect(result).toBe('object removed');
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
    const result = onObjectRemoved(event, context);
    return expect(result).rejects.toBe(`S3 failure`);
  });
});
