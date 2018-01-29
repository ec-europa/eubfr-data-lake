/**
 * @jest-environment node
 */

import onObjectCreated from '../../../src/events/onObjectCreated';

describe(`Function onObjectCreated in "@eubfr/value-store-projects"`, () => {
  test('The function requires API and INDEX environment variables', async () => {
    const event = {};
    const context = {};
    const callback = error => {
      expect(error.message).toEqual(
        'API and INDEX environment variables are required!'
      );
    };

    expect.assertions(1);

    await onObjectCreated(event, context, callback);
  });
});
