/**
 * @jest-environment node
 */

import onParseXLS from '../../../src/events/onParseXML';

describe(`Function onParseXLS in "@eubfr/ingestion-etl-budg-xls"`, () => {
  test('The function requires REGION and STAGE environment variables', async () => {
    const event = {};
    const context = {};

    expect.assertions(1);

    try {
      await onParseXLS(event, context);
    } catch (e) {
      expect(e.message).toEqual(
        'REGION and STAGE environment variables are required!'
      );
    }
  });
});
