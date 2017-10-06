import { promisify } from 'util';
import onObjectCreated from '../../../src/events/onObjectCreated';

const handler = promisify(onObjectCreated);

describe(`Function onObjectCreated in "@eubfr/value-store-projects"`, () => {
  test('The function expects records', () => {
    const event = {};
    const context = {};

    const result = handler(event, context);
    result
      .then(response => {
        // Either a null, error or a rejected promise because of bad input.
        expect(response).toBeFalsy();
      })
      .catch(e => expect(e).toBe('No record'));
  });
});
