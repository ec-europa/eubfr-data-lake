/**
 * @jest-environment node
 */

import { promisify } from 'util';
import onStatusReported from '../../../src/events/onStatusReported';

const handler = promisify(onStatusReported);

describe(`Function onCreate in "@eubfr/storage-meta-index"`, () => {
  test('The function expects a correct SNS record', () => {
    const event = {};
    const context = {};

    expect.assertions(1);
    const result = handler(event, context);
    return expect(result).rejects.toBe('No record');
  });
});
