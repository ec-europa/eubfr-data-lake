/**
 * @jest-environment node
 */

import onParseODS from '../../../src/events/onParseODS';

describe(`Function onParseODS in "@eubfr/ingestion-etl-2014uk16rfop001-ods"`, () => {
  test('The function requires BUCKET, REGION and STAGE environment variables', async () => {
    const event = {};
    const context = {};

    try {
      await onParseODS(event, context);
    } catch (error) {
      expect(error.message).toEqual(
        'BUCKET, REGION and STAGE environment variables are required!'
      );
    }
  });
});
