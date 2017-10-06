import { promisify } from 'util';
import { onCreate } from '../../src/handler';

const handler = promisify(onCreate);

describe(`Fuction onCreate() in "@eubfr/ingestion-manager"`, () => {
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
