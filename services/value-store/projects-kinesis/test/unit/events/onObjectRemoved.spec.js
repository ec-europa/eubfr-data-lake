/**
 * @jest-environment node
 */

import onObjectRemoved from '../../../src/events/onObjectRemoved';

describe(`Function onObjectRemoved in "@eubfr/value-store-projects-kinesis"`, () => {
  test('The function expects records', async () => {
    const event = {};
    const context = {};

    expect.assertions(1);

    const callback = error => {
      expect(error.message).toEqual('No record');
    };

    expect.assertions(1);

    await onObjectRemoved(event, context, callback);
  });
});
