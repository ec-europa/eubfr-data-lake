/**
 * @jest-environment node
 */

import onParseCSV from '../../../src/events/onParseCSV';

describe(`Function onParseCSV in "@eubfr/ingestion-etl-eac-csv"`, () => {
  test('The function requires BUCKET, REGION and STAGE', async () => {
    try {
      await onParseCSV();
    } catch (error) {
      expect(error.message).toEqual(
        'BUCKET, REGION and STAGE environment variables are required!'
      );
    }
  });
});
