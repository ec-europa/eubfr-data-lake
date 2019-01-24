/**
 * @jest-environment node
 */

import onObjectRemoved from '../../../src/events/onObjectRemoved';

describe(`Function onObjectRemoved in "@eubfr/value-store-projects"`, () => {
  test('The function expects records', async () => {
    const event = {};
    const context = {};

    try {
      await onObjectRemoved(event, context);
    } catch (error) {
      expect(error.message).toEqual('No record');
    }
  });
});
