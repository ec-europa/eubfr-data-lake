/**
 * @jest-environment node
 */

const extractBudgetData = require('../../extractBudgetData');

describe('extractBudgetData helper', () => {
  test('Should return an empty object when no arguments', () => {
    const result = extractBudgetData();
    expect(result).toEqual({});
  });

  test('Should contain original input in a property called "raw"', () => {
    const result = extractBudgetData('foo');
    expect(result.raw).toBe('foo');
  });

  test('Should take into account only information which is not in brackets and after column', () => {
    const input =
      'FEDER (Objectif 1, 1994-1999): 3 103 391 euros (20 356 911 FRF)';
    const result = extractBudgetData(input);
    expect(result.formatted).toBe(' 3 103 391 euros');
  });

  test('Should not deal with value when dashes', () => {
    const expected = {
      raw: 'EUR 2 013 392,5 - ERDF 1994-1999',
      formatted: 'EUR 2 013 392,5 - ERDF 1994-1999',
    };
    const input = 'EUR 2 013 392,5 - ERDF 1994-1999';
    const result = extractBudgetData(input);
    expect(result).toMatchObject(expected);
  });

  test('Should ignore multiple occurences of a given currency', () => {
    // No vlaue or currency is supposed to be extracted.
    const expected = {
      raw: 'DM 3 530 000 + DM 4 510 000',
      formatted: 'DM 3 530 000 + DM 4 510 000',
    };
    const input = 'DM 3 530 000 + DM 4 510 000';
    const result = extractBudgetData(input);
    expect(result).toMatchObject(expected);
  });

  test('Should ignore multiple currencies', () => {
    // No vlaue or currency is supposed to be extracted.
    const expected = {
      raw: 'DM 1 + GBP 2',
      formatted: 'DM 1 + GBP 2',
    };
    const input = 'DM 1 + GBP 2';
    const result = extractBudgetData(input);
    expect(result).toMatchObject(expected);
  });

  test('Should consider forward slashes', () => {
    const input = 'ATS 2 000 000/EUR 145 346';
    const result = extractBudgetData(input);
    expect(result.currency).toBe('EUR');
    expect(result.value).toBe('145 346');
  });

  test('Should extract value after column', () => {
    const input = 'EFRO, 1994-1999: 4.152.216,5 euro';
    const result = extractBudgetData(input);
    expect(result.value).toBe('4.152.216,5');
  });

  test('Should support € currency sign', () => {
    const input = '158,295,972.07€';
    const result = extractBudgetData(input);
    expect(result.currency).toBe('GBP');
    expect(result.value).toBe('158,295,972.07');
  });

  test('Should support EUR currency', () => {
    const input =
      'FEDER (Objectif 1, 1994-1999): 3 103 391 euros (20 356 911 FRF)';
    const result = extractBudgetData(input);
    expect(result.currency).toBe('EUR');
  });

  test('Should support ECU currency', () => {
    const input = 'ECU 536 000';
    const result = extractBudgetData(input);
    expect(result.currency).toBe('ECU');
  });

  test('Should support DM currency', () => {
    const input = 'DM 344 000';
    const result = extractBudgetData(input);
    expect(result.currency).toBe('DM');
  });

  test('Should support FF currency', () => {
    const input = 'FF 107 000 000';
    const result = extractBudgetData(input);
    expect(result.currency).toBe('FF');
  });

  test('Should support FIM currency', () => {
    const input = 'FIM 2,425,000';
    const result = extractBudgetData(input);
    expect(result.currency).toBe('FIM');
  });

  test('Should support SEK currency', () => {
    const input = 'SEK 1 650 000';
    const result = extractBudgetData(input);
    expect(result.currency).toBe('SEK');
  });

  test('Should support ESP currency', () => {
    const input =
      'ESP 1 142 900 000 (EUR 6 869 000 at current rates, EUR 9.2 million at 1991 rates)';
    const result = extractBudgetData(input);
    expect(result.currency).toBe('ESP');
  });

  test('Should take into account millions keyword', () => {
    const input = 'ERDF : EUR 2.7 million';
    const result = extractBudgetData(input);
    expect(result.value).toBe('2.7 m');
  });

  test('Should take into account millions without a keyword', () => {
    const input = 'EUR 64 300 000 (GBP 45 million)';
    const result = extractBudgetData(input);
    expect(result.value).toBe('64 300 000');
  });

  test('Should take into account millions with dot notation', () => {
    const input = 'EUR 3.196 million - Cohesion Fund';
    const result = extractBudgetData(input);
    expect(result.value).toBe('3.196 m');
  });

  test('Should convert values of millions with comma to dot notation', () => {
    const input = 'EUR 3,963 millions';
    const result = extractBudgetData(input);
    expect(result.value).toBe('3.963 m');
  });

  test('Should extract simple decimals', () => {
    const input =
      'FEDER (Objectif 1, 1994-1999): 3 103 391 euros (20 356 911 FRF)';
    const result = extractBudgetData(input);
    expect(result.value).toBe('3 103 391');
  });
});
