/**
 * @jest-environment node
 */

import mapper from '../../../src/lib/transform';
import record from '../../stubs/record.json';

describe('DG HOME XLS transformer', () => {
  let result = {};

  beforeAll(() => {
    result = mapper(record);
  });

  test('Returns null when record is not provided', () => {
    expect(mapper()).toBe(null);
  });

  test('Produces correct JSON output structure', () => {
    expect(result).toMatchSnapshot();
  });

  test('Budget values do not contain decimals', () => {
    expect(result.budget.eu_contrib.value % 1).toBe(0);
    expect(result.budget.total_cost.value % 1).toBe(0);
  });
});
