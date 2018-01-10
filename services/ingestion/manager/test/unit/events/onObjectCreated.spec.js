/**
 * @jest-environment node
 */

import { promisify } from 'util';
import onObjectCreated from '../../../src/events/onObjectCreated';

const handler = promisify(onObjectCreated);

describe(`Function onCreate in "@eubfr/ingestion-manager"`, () => {
  test('The function expects a correct SNS record', () => {
    const event = {};
    const context = {};

    expect.assertions(1);
    const result = handler(event, context);
    return expect(result).rejects.toBe(`Bad record`);
  });
});
