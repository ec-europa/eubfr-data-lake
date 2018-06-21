/**
 * @jest-environment node
 */

import onObjectCreated from '../../../src/events/onObjectCreated';

describe('Function onObjectCreated in "@eubfr/value-store-projects"', () => {
  test('The function requires several environment variables', async () => {
    const event = {};
    const context = {};
    const callback = error => {
      expect(error.message).toEqual('Missing environment variable!');
    };

    expect.assertions(1);

    await onObjectCreated(event, context, callback);
  });
});
