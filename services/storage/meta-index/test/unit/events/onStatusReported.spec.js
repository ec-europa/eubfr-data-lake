/**
 * @jest-environment node
 */

import onStatusReported from '../../../src/events/onStatusReported';

describe(`Function onCreate in "@eubfr/storage-meta-index"`, () => {
  test('The function expects a correct SNS record', async () => {
    const event = {};
    const context = {};

    expect.assertions(1);

    const callback = error => {
      expect(error.message).toEqual('No record');
    };

    expect.assertions(1);

    await onStatusReported(event, context, callback);
  });
});
