/**
 * @jest-environment node
 */

import onParseJSON from '../../../src/events/onParseJSON';

describe(`Function onParseJSON in "@eubfr/ingestion-etl-inforegio-json"`, () => {
  test('The function expects a correct SNS record', async () => {
    const event = {};
    const context = {};
    const callback = error => {
      expect(error.message).toEqual('Bad record');
    };

    expect.assertions(1);

    await onParseJSON(event, context, callback);
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
    const callback = error => {
      expect(error.message).toEqual('Unexpected token w in JSON at position 0');
    };

    expect.assertions(1);

    await onParseJSON(event, context, callback);
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
    const callback = error => {
      expect(error.message).toEqual('The message is not valid');
    };

    expect.assertions(2);

    await onParseJSON(event, context, callback);
    await onParseJSON(event2, context, callback);
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
    const callback = error => {
      expect(error.message).toEqual('File extension should be .json');
    };

    expect.assertions(1);

    await onParseJSON(event, context, callback);
  });
});
