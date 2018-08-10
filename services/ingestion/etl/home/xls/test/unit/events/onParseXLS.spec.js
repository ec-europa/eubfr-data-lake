/**
 * @jest-environment node
 */

import onParseXLS from '../../../src/events/onParseXLS';

describe(`Function onParseXLS in "@eubfr/ingestion-etl-home-xls"`, () => {
  test('The function requires BUCKET, REGION and STAGE', async () => {
    const event = {};
    const context = {};

    const callback = error => {
      expect(error.message).toEqual(
        'BUCKET, REGION and STAGE environment variables are required!'
      );
    };

    expect.assertions(1);

    await onParseXLS(event, context, callback);
  });
});
