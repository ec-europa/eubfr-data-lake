/**
 * @jest-environment node
 */

import onParseXLS from '../../../src/events/onParseXLS';

describe(`Function onParseXLS in "@eubfr/ingestion-etl-valor-xls"`, () => {
  test('The function expects a correct SNS record', async () => {
    const event = {};
    const context = {};

    expect.assertions(1);

    try {
      await onParseXLS(event, context);
    } catch (e) {
      expect(e.message).toEqual('Bad record');
    }
  });
});
