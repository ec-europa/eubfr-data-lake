/**
 * @jest-environment node
 */

import onObjectRemoved from '../../../src/events/onObjectRemoved';

describe(`Function onObjectRemoved in "@eubfr/ingestion-manager"`, () => {
  test('The function expects META_ENDPOINT and META_INDEX environment variables', async () => {
    const event = {};
    const context = {};
    const callback = error => {
      expect(error.message).toEqual(
        'META_ENDPOINT and META_INDEX environment variables are required!'
      );
    };

    expect.assertions(1);

    await onObjectRemoved(event, context, callback);
  });
});
