/**
 * @jest-environment node
 */

import onParseJSON from '../../../src/events/onParseJSON';

describe(`Function onParseJSON in "@eubfr/ingestion-etl-inforegio-json"`, () => {
  beforeEach(() => {
    process.env.BUCKET = 'foo';
    process.env.REGION = 'bar';
    process.env.STAGE = 'baz';
  });

  afterEach(() => {
    delete process.env.BUCKET;
    delete process.env.REGION;
    delete process.env.STAGE;
  });

  test('The function expects a correct SNS record', async () => {
    const event = {};
    const context = {};

    expect.assertions(1);

    try {
      await onParseJSON(event, context);
    } catch (error) {
      expect(error.message).toEqual('Bad record');
    }
  });

  test('The function expects a message with a well-formatted JSON object', async () => {
    const event = {
      Records: [
        {
          EventSource: 'aws:sns',
          Sns: {
            Message: 'wrong json message',
          },
        },
      ],
    };
    const context = {};

    try {
      await onParseJSON(event, context);
    } catch (error) {
      expect(error.message).toEqual('Unexpected token w in JSON at position 0');
    }
  });

  test('The handler fails if the Message does not have an object with a key', async () => {
    const event = {
      Records: [
        {
          EventSource: 'aws:sns',
          Sns: {
            Message: JSON.stringify({}),
          },
        },
      ],
    };
    const event2 = {
      Records: [
        {
          EventSource: 'aws:sns',
          Sns: {
            Message: JSON.stringify({
              object: '',
            }),
          },
        },
      ],
    };

    const context = {};

    try {
      await onParseJSON(event, context);
      await onParseJSON(event2, context);
    } catch (error) {
      expect(error.message).toEqual('The message is not valid');
    }
  });

  test('The handler fails if the object key does not end with `.json', async () => {
    const event = {
      Records: [
        {
          EventSource: 'aws:sns',
          Sns: {
            Message: JSON.stringify({ object: { key: 'test.js' } }),
          },
        },
      ],
    };

    const context = {};

    try {
      await onParseJSON(event, context);
    } catch (error) {
      expect(error.message).toEqual('File extension should be .json');
    }
  });
});
