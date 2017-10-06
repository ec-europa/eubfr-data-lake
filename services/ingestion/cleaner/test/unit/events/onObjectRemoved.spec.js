import AWS from 'aws-sdk-mock';

import { promisify } from 'util';
import onObjectRemoved from '../../../src/events/onObjectRemoved';

// Add stubs
import eventOfficial from '../../stubs/events/onObjectRemoved/event-official.json';
import eventEubfr from '../../stubs/events/onObjectRemoved/event-eubfr.json';

const handler = promisify(onObjectRemoved);

describe(`Function onObjectRemoved in "@eubfr/ingestion-cleaner"`, () => {
  beforeAll(() => {
    AWS.mock('S3', 'deleteObject', (params, callback) => {
      callback(null, 'Successfully deleted a file from the S3 storage');
    });
  });

  afterAll(() => {
    AWS.restore('S3', 'deleteObject');
  });

  test('The function requires a BUCKET environment variable', () => {
    const event = {};
    const context = {};

    const result = handler(event, context);
    result
      .then(response => {
        // Either a null, error or a rejected promise because of bad input.
        expect(response).toBeFalsy();
      })
      .catch(e => expect(e).toBe(`BUCKET environment variable is required`));
  });

  test('The function expects SNS record with the official event stub', () => {
    const event = {};
    const context = {
      BUCKET: 'bucket-foo',
    };

    const result = handler(event, context);
    result
      .then(response => {
        // Either a null, error or a rejected promise because of bad input.
        expect(response).toBeFalsy();
      })
      .catch(e => expect(e).toBe('Bad record'));
  });

  test('The function expects SNS record with the actual event stub', () => {
    const event = eventEubfr;
    const context = {};

    const result = handler(event, context);
    result
      .then(response => {
        // Either a null, error or a rejected promise because of bad input.
        expect(response).toBeFalsy();
      })
      .catch(e => expect(e).toBe('Bad record'));
  });

  test('The function validates for presence of a message body', () => {
    const event = eventEubfr;
    const context = {};

    const result = handler(event, context);
    result
      .then(data => {
        expect(data).toBeFalsy();
      })
      .catch(e => expect(e).toMatch(`Missing message body`));
  });
});
