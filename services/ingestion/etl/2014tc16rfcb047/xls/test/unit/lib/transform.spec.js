/**
 * @jest-environment node
 */

import mapper from '../../../src/lib/transform';
import testRecord from '../../stubs/record.json';

describe('2014tc16rfcb047 XLS transformer', () => {
  let result = {};

  beforeAll(() => {
    result = mapper(testRecord);
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

  test('Handles an exceptional date format DD.MM.YYYY', () => {
    const copy = JSON.parse(JSON.stringify(testRecord));
    copy['Operation Start Date'] = '31.12.2021';
    const transformed = mapper(copy);
    expect(transformed.timeframe.from).toBe('2021-12-31T00:00:00.000Z');
  });
});
