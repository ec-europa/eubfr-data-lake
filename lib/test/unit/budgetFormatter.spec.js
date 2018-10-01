/**
 * @jest-environment node
 */

const {
  sanitizeBudgetItem,
  sanitizeValue,
  extractEuro,
} = require('../../budgetFormatter');

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

describe('budgetFormatter module: sanitizeValue helper', () => {
  test('Returns 0 if nothing is provided', () => {
    const result = sanitizeValue();
    expect(result).toBe(0);
  });
});

describe('budgetFormatter module: extractEuro helper', () => {
  test('Returns original input value if nothing exceptional in it', () => {
    const result = extractEuro('1000');
    expect(result).toBe('1000');
  });

  test("Handling exception: 'ERDF : EUR 961 000'", () => {
    const result = extractEuro('ERDF : EUR 961 000');
    expect(result).toBe('961 000');
  });

  test('Handling exception: FEDER (Objectif 1, 1994-1999) ...', () => {
    const result = extractEuro(
      'FEDER (Objectif 1, 1994-1999): 3 103 391 euros (20 356 911 FRF)'
    );
    expect(result).toBe('3 103 391');
  });

  test("Returns 0 because can't handle: 'ERDF contribution: 53.8%'", () => {
    const result = extractEuro('ERDF contribution: 53.8%');
    expect(result).toBe(0);
  });

  test("Handling exception: 'Feder (Objectif 5b) ...'", () => {
    const result = extractEuro(
      'Feder (Objectif 5b) 80 798 euros (530 000 FRF)'
    );
    expect(result).toBe('80 798');
  });

  test("Handling exception: 'XXX Euros (ERDF - Peace CI)'", () => {
    const result = extractEuro('9,523,036 Euros (ERDF - Peace CI)');
    expect(result).toBe('9,523,036');
  });
});
