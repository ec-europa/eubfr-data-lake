/**
 * @jest-environment node
 */

import onParseJSON from '../../../src/events/onParseJSON';

describe(`Function onParseJSON in "@eubfr/ingestion-etl-inforegio-json"`, () => {
  test('The function expects a correct SNS record', async () => {
    const event = {};
    const context = {};

    expect.assertions(1);

    try {
      await onParseJSON(event, context);
    } catch (e) {
      expect(e.message).toEqual('Bad record');
    }
  });
});
