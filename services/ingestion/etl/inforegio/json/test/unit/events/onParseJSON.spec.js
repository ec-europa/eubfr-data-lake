import { promisify } from 'util';
import onParseCSV from '../../../src/events/onParseJSON';

const handler = promisify(onParseCSV);

describe(`Function parseJson in "@eubfr/ingestion-etl-inforegio-json"`, () => {
  test('The function expects a correct SNS record', () => {
    const event = {};
    const context = {};

    expect.assertions(1);
    const result = handler(event, context);
    return expect(result).rejects.toBe(`Bad record`);
  });
});
