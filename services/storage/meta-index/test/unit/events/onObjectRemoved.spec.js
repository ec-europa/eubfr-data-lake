import { promisify } from 'util';
import onObjectRemoved from '../../../src/events/onObjectRemoved';

const handler = promisify(onObjectRemoved);

describe(`Function onObjectRemoved in "@eubfr/storage-meta-index"`, () => {
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
