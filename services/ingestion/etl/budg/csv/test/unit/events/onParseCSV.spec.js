import { promisify } from 'util';
import onParseCSV from '../../../src/events/onParseCSV';

const handler = promisify(onParseCSV);

describe(`Function parseCsv in "@eubfr/ingestion-etl-budg-csv"`, () => {
  test('The function expects a correct SNS record', () => {
    const event = {};
    const context = {};

    expect.assertions(1);
    const result = handler(event, context);
    return expect(result).rejects.toBe(`Bad record`);
  });
});
