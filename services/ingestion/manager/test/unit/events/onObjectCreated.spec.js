/**
 * @jest-environment node
 */

import onObjectCreated from '../../../src/events/onObjectCreated';

describe(`Function onCreate in "@eubfr/ingestion-manager"`, () => {
  test('The function expects a correct SNS record', async () => {
    const event = {};
    const context = {};
    const callback = error => {
      expect(error.message).toEqual(
        'API, INDEX, REGION and STAGE environment variables are required!'
      );
    };

    expect.assertions(1);

    await onObjectCreated(event, context, callback);
  });
});
