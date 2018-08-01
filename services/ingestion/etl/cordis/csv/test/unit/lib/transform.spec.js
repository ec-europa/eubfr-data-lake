/**
 * @jest-environment node
 */

import mapper from '../../../src/lib/transform';
import testRecord from '../../stubs/record.json';
import testRecord2 from '../../stubs/record2.json';

describe('DG CORDIS CSV transformer', () => {
  let result = {};
  let resultMultiple = {};

  beforeAll(() => {
    result = mapper(testRecord);
    resultMultiple = mapper(testRecord2);
  });

  test('Returns null when record is not provided', () => {
    expect(mapper()).toBe(null);
  });

  test('Produces correct JSON output structure', () => {
    expect(result).toMatchSnapshot();
  });

  test('Can handle multi-value inputs for participants and coordinators', () => {
    expect(resultMultiple).toMatchSnapshot();
  });
});
