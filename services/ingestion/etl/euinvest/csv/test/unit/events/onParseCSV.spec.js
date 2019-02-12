/**
 * @jest-environment node
 */

import onParseCSV from '../../../src/events/onParseCSV';

describe(`Function parseCsv in "@eubfr/ingestion-etl-euinvest-csv"`, () => {
  test('The function requires BUCKET, REGION and STAGE environment variables', async () => {
    try {
      await onParseCSV();
    } catch (error) {
      expect(error.message).toEqual(
        'BUCKET, REGION and STAGE environment variables are required!'
      );
    }
  });
});
