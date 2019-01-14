/**
 * @jest-environment node
 */

const extractBudgetData = require('../../../budget/extractBudgetData');

describe('extractBudgetData helper', () => {
  test('Should return an empty object when no arguments', () => {
    const result = extractBudgetData();
    expect(result).toEqual({});
  });

  test('Should contain original input in a property called "raw"', () => {
    const result = extractBudgetData('foo');
    expect(result.raw).toBe('foo');
    expect(result.currency).toBe('');
    expect(result.value).toEqual(0);
  });

  test('Should not modify numbers', () => {
    const result = extractBudgetData(149056357);
    expect(result).toEqual({});
  });

  test('Should not modify numbers without currencies', () => {
    const result = extractBudgetData('149 056 357');
    expect(result.currency).toBe('');
    expect(result.value).toEqual(0);
  });

  test('Should take into account only information which is not in brackets', () => {
    const input =
      'FEDER (Objectif 1, 1994-1999): 3 103 391 euros (20 356 911 FRF)';
    const result = extractBudgetData(input);
    expect(result.formatted).toBe('FEDER: 3 103 391 euros');
  });

  test('Should not consider dashes', () => {
    const input = 'EUR 2 013 392,5 - ERDF 1994-1999';
    const result = extractBudgetData(input);
    expect(result.currency).toBe('');
    expect(result.value).toEqual(0);
  });

  test('Should not consider forward slashes', () => {
    const input = 'ATS 2 000 000/EUR 145 346';
    const result = extractBudgetData(input);
    expect(result.currency).toBe('');
    expect(result.value).toEqual(0);
  });

  test('Should not consider columns', () => {
    const input = 'EFRO, 1994-1999: 4.152.216,5 euro';
    const result = extractBudgetData(input);
    expect(result.currency).toBe('');
    expect(result.value).toEqual(0);
  });

  test('Should not consider plus sign', () => {
    const input = 'DM 3 530 000 + DM 4 510 000';
    const result = extractBudgetData(input);
    expect(result.currency).toBe('');
    expect(result.value).toEqual(0);
  });

  test('Should not consider multiple currencies', () => {
    const input = 'EUR 3.5 million DEM';
    const result = extractBudgetData(input);
    expect(result.currency).toBe('');
    expect(result.value).toEqual(0);
  });

  test('Should not consider multiple different currencies', () => {
    const input = '$ 1,000  million EUR';
    const result = extractBudgetData(input);
    expect(result.currency).toBe('');
    expect(result.value).toEqual(0);
  });

  test('Should support € currency sign', () => {
    const input = '158,295,972.07€';
    const result = extractBudgetData(input);
    expect(result.currency).toBe('EUR');
    expect(result.value).toBe('158,295,972.07');
  });

  test('Should support £ currency sign', () => {
    const input = '100£';
    const result = extractBudgetData(input);
    expect(result.currency).toBe('GBP');
    expect(result.value).toBe('100');
  });

  test('Should support $ currency sign', () => {
    const input = '0.50$';
    const result = extractBudgetData(input);
    expect(result.currency).toBe('USD');
    expect(result.value).toBe('0.50');
  });

  test('Should support EUR currency', () => {
    const input = '1 EUR';
    const result = extractBudgetData(input);
    expect(result.currency).toBe('EUR');
  });

  test('Should not support EUR currency: in lowercase and plural', () => {
    const result = extractBudgetData(
      '(Objectif 5b 1994-1996) 60 979 euros (400 000 FRF)'
    );
    expect(result.currency).toBe('');
    expect(result.value).toEqual(0);
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
    const input = 'EUR 2.7 million';
    const result = extractBudgetData(input);
    expect(result.value).toBe('2.7 m');
  });

  test('Should not take into account French millions keyword', () => {
    const input = "2,5 millions d'euros";
    const result = extractBudgetData(input);
    expect(result.currency).toBe('');
    expect(result.value).toEqual(0);
  });

  test('Should take into account millions without a keyword', () => {
    const input = 'EUR 64 300 000 (GBP 45 million)';
    const result = extractBudgetData(input);
    expect(result.value).toBe('64 300 000');
  });

  test('Should take into account millions with dot notation', () => {
    const input = 'EUR 3.196 million';
    const result = extractBudgetData(input);
    expect(result.value).toBe('3.196 m');
  });

  test('Should convert values of millions with comma to dot notation', () => {
    const input = 'EUR 3,963 millions';
    const result = extractBudgetData(input);
    expect(result.value).toBe('3.963 m');
  });

  test('Should not support cases where millions contain spaces', () => {
    const input = 'EUR 3 1000 million';
    const result = extractBudgetData(input);
    expect(result.currency).toBe('');
    expect(result.value).toEqual(0);
  });

  test('Should not support cases where millions contain spaces and comma', () => {
    const input = '3 1,000 million $';
    const result = extractBudgetData(input);
    expect(result.currency).toBe('');
    expect(result.value).toEqual(0);
  });

  test('Should not support cases where millions contain spaces and dot', () => {
    const input = 'EUR 3 1.000 million';
    const result = extractBudgetData(input);
    expect(result.currency).toBe('');
    expect(result.value).toEqual(0);
  });

  test('Should take into account billion keyword', () => {
    const input = 'EUR 1.194 billion';
    const result = extractBudgetData(input);
    expect(result.value).toBe('1.194 b');
  });

  test('Should not support cases where billions contain spaces', () => {
    const input = 'EUR 3 1000 billion';
    const result = extractBudgetData(input);
    expect(result.currency).toBe('');
    expect(result.value).toEqual(0);
  });

  test('Should not support cases where billions contain spaces and comma', () => {
    const input = '3 1,000 billion $';
    const result = extractBudgetData(input);
    expect(result.currency).toBe('');
    expect(result.value).toEqual(0);
  });

  test('Should not support cases where billions contain spaces and dot', () => {
    const input = 'EUR 3 1.000 billion';
    const result = extractBudgetData(input);
    expect(result.currency).toBe('');
    expect(result.value).toEqual(0);
  });

  test('Should take into account French billions keyword', () => {
    const input = "2,5 billions d'euros";
    const result = extractBudgetData(input);
    expect(result.currency).toBe('');
    expect(result.value).toEqual(0);
  });

  test('Should not support millions of billions', () => {
    const input = 'EUR 3.5 million billion';
    const result = extractBudgetData(input);
    expect(result.currency).toBe('');
    expect(result.value).toEqual(0);
  });

  test('Should not support billions of millions', () => {
    const input = 'EUR 3.5 billion million';
    const result = extractBudgetData(input);
    expect(result.currency).toBe('');
    expect(result.value).toEqual(0);
  });

  test('Should not support billions of millions even in symbolic way', () => {
    const input = '€$ 20  billion';
    const result = extractBudgetData(input);
    expect(result.currency).toBe('');
    expect(result.value).toEqual(0);
  });

  test('Should not deal with cases of one currency and two numbers', () => {
    const input = '20 EUR 40';
    const result = extractBudgetData(input);
    expect(result.value).toBe(0);
    expect(result.currency).toBe('');
  });

  test('Should not deal with multiples within strings even leaving brackets', () => {
    const input =
      '1 million de FF par an (mission de base CASIMIR); 2 millions de FF (nouveau bâtiment) ; 1,6 millions de FF (projet RIS 1997-1998)';
    const result = extractBudgetData(input);
    expect(result.value).toBe(0);
    expect(result.currency).toBe('');
  });
});
