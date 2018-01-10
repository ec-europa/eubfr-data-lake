/**
 * @jest-environment node
 */

import { promisify } from 'util';
import onObjectRemoved from '../../../src/events/onObjectRemoved';

const handler = promisify(onObjectRemoved);

describe(`Function onObjectRemoved in "@eubfr/storage-meta-index"`, () => {
  test('The function expects records', () => {
    const event = {};
    const context = {};

    expect.assertions(1);
    const result = handler(event, context);
    return expect(result).rejects.toBe(`No record`);
  });
});
