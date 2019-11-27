/**
 * @jest-environment node
 */

import mapper from '../../../src/lib/transform';
import testRecord from '../../stubs/record.json';

describe('2014tc16i5cb005 CSV transformer', () => {
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

  test('Handles varying values for field `Project EU co-financing rate`', () => {
    const copy1 = JSON.parse(JSON.stringify(testRecord));
    const copy2 = JSON.parse(JSON.stringify(testRecord));

    // The value of total is in field `Project final contract amount`.
    // In both cases below, the value is 591955.11 and we test how other field containing varying values affect the total.

    copy1['Project EU co-financing rate'] = '99.00%';
    const copyResult1 = mapper(copy1);
    // In this case percentage is calculated from total.
    // Values less than 100 should be treated as percentages.
    expect(copyResult1.budget.eu_contrib.value).toBe(586035);

    copy2['Project EU co-financing rate'] = '500665.00%';
    const copyResult2 = mapper(copy2);
    // Values greater than 100 should not be treated as percentages.
    expect(copyResult2.budget.eu_contrib.value).toBe(500665);
  });

  test('Budget values do not contain decimals', () => {
    expect(result.budget.eu_contrib.value % 1).toBe(0);
    expect(result.budget.total_cost.value % 1).toBe(0);
  });
});
