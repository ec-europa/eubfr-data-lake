/**
 * @jest-environment node
 */

import onParseCSV from '../../../src/events/onParseCSV';

describe(`Function parseCsv in "@eubfr/ingestion-etl-iati-csv"`, () => {
  test('The function requires BUCKET, REGION and STAGE environment variables', async () => {
    const event = {};
    const context = {};

    const callback = error => {
      expect(error.message).toEqual(
        'BUCKET, REGION and STAGE environment variables are required!'
      );
    };

    expect.assertions(1);

    await onParseCSV(event, context, callback);
  });
});
