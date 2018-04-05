/**
 * @jest-environment node
 */

import mapper from '../../../src/lib/transform';
import testRecord from '../../stubs/record.json';

describe('XLS transformer for WIFI4EU', () => {
  let results = {};

  beforeAll(() => {
    results = mapper(testRecord);
  });

  test('Throws an error on empty input', () => {
    expect(mapper).toThrow();
  });

  test('Produces correct JSON output structure', () => {
    expect(results).toMatchSnapshot();
  });
});
