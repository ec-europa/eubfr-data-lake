/**
 * @jest-environment node
 */

import onParseCSV from '../../../src/events/onParseCSV';

describe(`Function parseCsv in "@eubfr/ingestion-etl-just-csv"`, () => {
  test('The function requires BUCKET, REGION and STAGE environment variables', async () => {
    const event = {};
    const context = {};

    try {
      await onParseCSV(event, context);
    } catch (error) {
      expect(error.message).toEqual(
        'BUCKET, REGION and STAGE environment variables are required!'
      );
    }
  });
});
