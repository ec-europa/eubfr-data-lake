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

    copy1['Project EU co-financing rate'] = '99.00%';
    const copyResult1 = mapper(copy1);
    // In this case percentage is calculated from total, i.e.
    // expect(testRecord['Project final contract amount']).toBe('591955.11');
    // Values less than 100 should be treated as percentages.
    expect(copyResult1.budget.eu_contrib.value).toBe(586035.5589);

    copy2['Project EU co-financing rate'] = '500665.00%';
    const copyResult2 = mapper(copy2);
    // Values greater than 100 should not be treated as percentages.
    expect(copyResult2.budget.eu_contrib.value).toBe(500665.00000000006);
  });
});
