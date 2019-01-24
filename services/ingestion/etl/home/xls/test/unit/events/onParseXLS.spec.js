/**
 * @jest-environment node
 */

import onParseXLS from '../../../src/events/onParseXLS';

describe(`Function onParseXLS in "@eubfr/ingestion-etl-home-xls"`, () => {
  test('The function requires BUCKET, REGION and STAGE environment variables', async () => {
    const event = {};
    const context = {};

    try {
      await onParseXLS(event, context);
    } catch (error) {
      expect(error.message).toEqual(
        'BUCKET, REGION and STAGE environment variables are required!'
      );
    }
  });
});
