import { promisify } from 'util';
import onParseCSV from '../../../src/events/onParseCSV';

const handler = promisify(onParseCSV);

describe(`Function parseCsv in "@eubfr/ingestion-etl-budg-csv"`, () => {
  test('The function expects a correct SNS record', () => {
    const event = {};
    const context = {};

    const result = handler(event, context);
    result
      .then(response => {
        // Either a null, error or a rejected promise because of bad input.
        expect(response).toBeFalsy();
      })
      .catch(e => expect(e).toBe('Bad record'));
  });
});
