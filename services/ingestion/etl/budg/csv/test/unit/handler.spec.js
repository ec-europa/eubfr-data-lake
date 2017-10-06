import { promisify } from 'util';
import { parseCsv } from '../../src/handler';

const handler = promisify(parseCsv);

describe(`Fuction parseCsv() in "@eubfr/ingestion-etl-budg-csv"`, () => {
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
