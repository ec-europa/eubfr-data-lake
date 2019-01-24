/**
 * @jest-environment node
 */

import onObjectRemoved from '../../../src/events/onObjectRemoved';

describe(`Function onObjectRemoved in "@eubfr/ingestion-manager"`, () => {
  test('The function expects API and INDEX environment variables', async () => {
    const event = {};
    const context = {};

    try {
      await onObjectRemoved(event, context);
    } catch (error) {
      expect(error.message).toEqual(
        'API and INDEX environment variables are required!'
      );
    }

    expect.assertions(1);
  });
});
