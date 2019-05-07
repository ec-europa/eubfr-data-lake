/**
 * @jest-environment node
 */

import mapper from '../../../src/lib/transform';
import testRecord from '../../stubs/record.json';

describe('XLS transformer for 2014uk16rfop003', () => {
  let results = {};

  beforeAll(() => {
    results = mapper(testRecord);
  });

  test('Returns null when record is not provided', () => {
    expect(mapper()).toBe(null);
  });

  test('Produces correct JSON output structure', () => {
    expect(results).toMatchSnapshot();
  });
});
