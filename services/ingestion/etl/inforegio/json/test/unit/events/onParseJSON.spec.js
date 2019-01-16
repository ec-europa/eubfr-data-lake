/**
 * @jest-environment node
 */

import onParseJSON from '../../../src/events/onParseJSON';

describe(`Function parseCsv in "@eubfr/ingestion-etl-inforegio-json"`, () => {
  test('The function requires BUCKET, REGION and STAGE environment variables', async () => {
    const event = {};
    const context = {};

    try {
      await onParseJSON(event, context);
    } catch (error) {
      expect(error.message).toEqual(
        'BUCKET, REGION and STAGE environment variables are required!'
      );
    }
  });
});
