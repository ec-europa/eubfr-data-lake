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

  test('Should take into account only information which is not in brackets', () => {
    const input =
      'FEDER (Objectif 1, 1994-1999): 3 103 391 euros (20 356 911 FRF)';
    const result = extractBudgetData(input);
    expect(result.formatted).toBe('FEDER: 3 103 391 euros');
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

  test('Should take into account millions keyword', () => {
    const input = 'ERDF : EUR 2.7 million';
    const result = extractBudgetData(input);
    expect(result.value).toBe('2.7 m');
  });

  test('Should extract simple decimals', () => {
    const input =
      'FEDER (Objectif 1, 1994-1999): 3 103 391 euros (20 356 911 FRF)';
    const result = extractBudgetData(input);
    expect(result.value).toBe('3 103 391');
  });
});
