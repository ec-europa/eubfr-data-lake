import { promisify } from 'util';
import onObjectCreated from '../../../src/events/onObjectCreated';

const handler = promisify(onObjectCreated);

describe(`Function onObjectCreated in "@eubfr/storage-meta-index"`, () => {
  test('The function expects records', () => {
    const event = {};
    const context = {};

    expect.assertions(1);
    const result = handler(event, context);
    return expect(result).rejects.toBe(`No record`);
  });
});
