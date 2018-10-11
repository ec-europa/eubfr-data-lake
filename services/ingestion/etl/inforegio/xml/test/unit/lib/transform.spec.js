/**
 * @jest-environment node
 */

import mapper from '../../../src/lib/transform';
import testRecord from '../../stubs/record.json';
import testRecordBudget from '../../stubs/recordBudget.json';

describe('DG INFOREGIO XLS transformer', () => {
  let result = {};
  let resultBudget = {};

  beforeAll(() => {
    result = mapper(testRecord);
    resultBudget = mapper(testRecordBudget);
  });

  test('Returns null when record is not provided', () => {
    expect(mapper()).toBe(null);
  });

  test('Produces correct JSON output structure', () => {
    expect(result).toMatchSnapshot();
  });

  test('Preserves badly formatted budget', () => {
    expect(resultBudget).toMatchSnapshot();
  });
});
