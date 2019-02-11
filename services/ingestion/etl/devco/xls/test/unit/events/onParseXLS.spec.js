/**
 * @jest-environment node
 */

import onParseXLS from '../../../src/events/onParseXLS';

describe(`Function parseXls in "@eubfr/ingestion-etl-devco-xls"`, () => {
  test('The function requires BUCKET, REGION and STAGE environment variables', async () => {
    try {
      await onParseXLS();
    } catch (error) {
      expect(error.message).toEqual(
        'BUCKET, REGION and STAGE environment variables are required!'
      );
    }
  });
});
