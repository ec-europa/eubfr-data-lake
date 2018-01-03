import onParseCSV from '../../../src/events/onParseCSV';

describe(`Function parseCsv in "@eubfr/ingestion-etl-agri-csv"`, () => {
  test('The function expects a correct SNS record', async () => {
    const event = {};
    const context = {};

    expect.assertions(1);

    try {
      await onParseCSV(event, context);
    } catch (e) {
      expect(e.message).toEqual('Bad record');
    }
  });
});
