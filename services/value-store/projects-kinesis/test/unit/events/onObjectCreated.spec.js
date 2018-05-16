/**
 * @jest-environment node
 */

import onObjectCreated from '../../../src/events/onObjectCreated';

describe(`Function onObjectCreated in "@eubfr/value-store-projects-kinesis"`, () => {
  test('The function requires API, INDEX, REGION and STAGE environment variables', async () => {
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
