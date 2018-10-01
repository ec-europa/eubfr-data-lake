/**
 * @jest-environment node
 */

const { sanitizeBudgetItem } = require('../../budgetFormatter');

describe('budgetFormatter module: sanitizeBudgetItem helper', () => {
  test('Should return default BudgetItem type when no arguments', () => {
    const result = sanitizeBudgetItem();
    expect(result).toMatchSnapshot();
  });

  test('Currency ECU should be treated equal to EUR', () => {
    const input = { value: '1259101', currency: 'ECU', raw: 'ECU 1 259 101' };
    const result = sanitizeBudgetItem(input);
    expect(result).toMatchSnapshot();
    expect(result.currency).toBe('EUR');

    const valueFromRaw = result.raw.replace(/ECU/gi, '').replace(/\s/g, '');
    expect(result.value).toEqual(Number(valueFromRaw));
  });
});
