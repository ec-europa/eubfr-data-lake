/**
 * @jest-environment node
 */

import onParseXLS from '../../../src/events/onParseXML';

describe(`Function onParseXLS in "@eubfr/ingestion-etl-budg-xls"`, () => {
  test('The function requires REGION and STAGE environment variables', async () => {
    const event = {};
    const context = {};
    const callback = error => {
      expect(error.message).toEqual(
        'REGION and STAGE environment variables are required!'
      );
    };

    expect.assertions(1);

    await onParseXLS(event, context, callback);
  });
});
