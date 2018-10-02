/**
 * @jest-environment node
 */

const {
  sanitizeBudgetItem,
  sanitizeValue,
  extractMonetaryValue,
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

describe('budgetFormatter module: extractMonetaryValue helper', () => {
  test('Returns original input value if nothing exceptional in it: simply numeric like 1000', () => {
    const result = extractMonetaryValue('1000');
    expect(result).toBe('1000');
  });

  test("Returns original input value also if number contains dots and commas: '200,000.00'", () => {
    const result = extractMonetaryValue('200,000.00');
    expect(result).toBe('200,000.00');
  });

  test("Can't handle: 'ERDF contribution: 53.8%'", () => {
    const result = extractMonetaryValue('ERDF contribution: 53.8%');
    expect(result).toBe(0);
  });

  test("Can't handle: '49 % of eligible costs'", () => {
    const result = extractMonetaryValue('49 % of eligible costs');
    expect(result).toBe(0);
  });

  test("Can't handle: 'DKR 1 220 000 + DKR 1 380 000'", () => {
    const result = extractMonetaryValue('DKR 1 220 000 + DKR 1 380 000');
    expect(result).toBe(0);
  });

  test("Can't handle: 'Interreg II puis Interreg III A se monte à 50% du coût total'", () => {
    const result = extractMonetaryValue(
      'Interreg II puis Interreg III A se monte à 50% du coût total'
    );
    expect(result).toBe(0);
  });

  test("Can handle: custom currencies inside expression: 'ERDF contribution (1994-99): ESP 3 559 million (at 31 December 1998)'", () => {
    const result = extractMonetaryValue(
      'ERDF contribution (1994-99): ESP 3 559 million (at 31 December 1998)'
    );
    expect(result).toBe(0);
  });

  test("Can't handle: custom currency prefixes 'FIM 254 760'", () => {
    const result = extractMonetaryValue('FIM 254 760');
    expect(result).toBe(0);
  });

  test("Can't handle: custom currency suffixes '680 000 FIM'", () => {
    const result = extractMonetaryValue('680 000 FIM');
    expect(result).toBe(0);
  });

  test("Can't handle: multilingual millions '1,05 Millionen Euro'", () => {
    const result = extractMonetaryValue('1,05 Millionen Euro');
    expect(result).toBe(0);
  });

  test("Can't handle: millions in custom currencies 'ESP 742 million (50% of eligible cost)'", () => {
    const result = extractMonetaryValue(
      'ESP 742 million (50% of eligible cost)'
    );
    expect(result).toBe(0);
  });

  test("Can handle: 'ERDF : EUR 961 000'", () => {
    const result = extractMonetaryValue('ERDF : EUR 961 000');
    expect(result).toBe('961 000');
  });

  test("Can handle: 'FEDER (Objectif 1, 1994-1999) ...'", () => {
    const result = extractMonetaryValue(
      'FEDER (Objectif 1, 1994-1999): 3 103 391 euros (20 356 911 FRF)'
    );
    expect(result).toBe('3 103 391');
  });

  test("Can handle: 'Feder (Objectif 5b) ...'", () => {
    const result = extractMonetaryValue(
      'Feder (Objectif 5b) 80 798 euros (530 000 FRF)'
    );
    expect(result).toBe('80 798');
  });

  test("Can handle: 'XXX Euros (ERDF - Peace CI)'", () => {
    const result = extractMonetaryValue('9,523,036 Euros (ERDF - Peace CI)');
    expect(result).toBe('9,523,036');
  });

  test("Can handle: 'ERDF : EUR 2.7 million'", () => {
    const result = extractMonetaryValue('ERDF : EUR 2.7 million');
    expect(result).toBe('2.7 m');
  });

  test("Can handle: 'EUR 2 013 392,5 - ERDF 1994-1999'", () => {
    const result = extractMonetaryValue('EUR 2 013 392,5 - ERDF 1994-1999');
    expect(result).toBe('2 013 392.5');
  });

  test("Can handle: 'EUR 36,505,926.49'", () => {
    const result = extractMonetaryValue('EUR 36,505,926.49');
    expect(result).toBe('36,505,926.49');
  });

  test("Can handle: 'EUR 8.000.000'", () => {
    const result = extractMonetaryValue('EUR 8.000.000');
    expect(result).toBe('8,000,000');
  });

  test("Can handle: 'EUR 8,000,000'", () => {
    const result = extractMonetaryValue('EUR 8,000,000');
    expect(result).toBe('8,000,000');
  });

  test("Can handle: 'euro 99 000 000'", () => {
    const result = extractMonetaryValue('euro 99 000 000');
    expect(result).toBe('99 000 000');
  });

  test("Can handle: '325 000 euros'", () => {
    const result = extractMonetaryValue('325 000 euros');
    expect(result).toBe('325 000');
  });

  test("Can handle: 'EURO 121 (88 GBP)'", () => {
    const result = extractMonetaryValue('EURO 121 (88 GBP)');
    expect(result).toBe('121');
  });

  test("Can handle: 'EFRO, 1994-1999: 4.152.216,5 euro'", () => {
    const result = extractMonetaryValue('EFRO, 1994-1999: 4.152.216,5 euro');
    expect(result).toBe('4,152,216,5');
  });

  test("Can handle: 'EUR 64 300 000 (GBP 45 million)'", () => {
    const result = extractMonetaryValue('EUR 64 300 000 (GBP 45 million)');
    expect(result).toBe('64 300 000');
  });

  test("Can handle: 'ERDF contribution: 65% (1.838.000 EUR)'", () => {
    const result = extractMonetaryValue(
      'ERDF contribution: 65% (1.838.000 EUR)'
    );
    expect(result).toBe('1,838,000');
  });

  test("Can handle: dot notation and plural '43.000.000 euros'", () => {
    const result = extractMonetaryValue('43.000.000 euros');
    expect(result).toBe('43,000,000');
  });

  test("Can handle: multiple entries 'ESP 1 142 900 000 (EUR 6 869 000 at current rates, EUR 9.2 million at 1991 rates)'", () => {
    const result = extractMonetaryValue(
      'ESP 1 142 900 000 (EUR 6 869 000 at current rates, EUR 9.2 million at 1991 rates)'
    );
    expect(result).toBe('6 869 000');
  });
});
