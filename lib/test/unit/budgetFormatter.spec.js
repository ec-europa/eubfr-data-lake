/**
 * @jest-environment node
 */

const { prepareValue } = require('../../budgetFormatter');

describe('budgetFormatter plugin: prepareValue method', () => {
  test('Should return the original input if non-string value is passed', () => {
    const result = prepareValue(1000);
    expect(result).toEqual(1000);
  });

  test('Should keep single dot when float number', () => {
    const result = prepareValue(158295972.07);
    expect(result).toEqual(158295972.07);
  });

  test('Should return the original input if string is not exceptional', () => {
    const result = prepareValue('1000');
    expect(result).toEqual('1000');
  });

  test('Should remove the single dot when more than 2 characters behind the sign', () => {
    const result = prepareValue('8000.000');
    expect(result).toEqual('8000000');
  });

  test('Should remove whitespaces when single dot and more than 2 characters behind the sign', () => {
    const result = prepareValue('8 000.000');
    expect(result).toEqual('8000000');
  });

  test('Should not modify cases of single dot and less than 2 characters behind the sign', () => {
    const result = prepareValue('8000.0');
    expect(result).toEqual('8000.0');
  });

  test('Should not modify cases of single dot and 2 characters behind the sign', () => {
    const result = prepareValue('100.00');
    expect(result).toEqual('100.00');
  });

  test('Should convert comma to dot when there are 2 or less characters behind it', () => {
    const result = prepareValue('8000,00');
    expect(result).toEqual('8000.00');
  });

  test('Should remove single comma when more than 2 characters behind it', () => {
    const result = prepareValue('8000,000');
    expect(result).toEqual('8000000');
  });

  test('Should remove whitespaces and single comma when more than 2 characters behind it', () => {
    const result = prepareValue('8 000,000');
    expect(result).toEqual('8000000');
  });

  test('Should remove all dots when they are more than one', () => {
    const result = prepareValue('8.000.000');
    expect(result).toEqual('8000000');
  });

  test('Should remove also whitespaces when many dots', () => {
    const result = prepareValue('10 000.000.000');
    expect(result).toEqual('10000000000');
  });

  test('Should remove all commas when they are more than one', () => {
    const result = prepareValue('8,000,000');
    expect(result).toEqual('8000000');
  });

  test('Should remove also whitespaces when many commas', () => {
    const result = prepareValue('10 000,000,000');
    expect(result).toEqual('10000000000');
  });

  test('Should keep single dot when mixed with several commas', () => {
    const result = prepareValue('158,295,972.07');
    expect(result).toEqual('158295972.07');
  });

  test('Should respect thousands notation for numeral: keep dot', () => {
    const result = prepareValue('2.7 k');
    expect(result).toEqual('2.7 k');
  });

  test('Should respect thousands notation for numeral: convert comma to dot', () => {
    const result = prepareValue('2,7 k');
    expect(result).toEqual('2.7 k');
  });

  test('Should respect millions notation for numeral: keep dot', () => {
    const result = prepareValue('2.7 m');
    expect(result).toEqual('2.7 m');
  });

  test('Should respect millions notation for numeral: convert comma to dot', () => {
    const result = prepareValue('2,7 m');
    expect(result).toEqual('2.7 m');
  });

  test('Should respect billions notation for numeral: keep dot', () => {
    const result = prepareValue('2.5 b');
    expect(result).toEqual('2.5 b');
  });

  test('Should respect billions notation for numeral: convert comma to dot', () => {
    const result = prepareValue('2,5 b');
    expect(result).toEqual('2.5 b');
  });

  test('Should respect trillions notation for numeral: keep dot', () => {
    const result = prepareValue('2.7 t');
    expect(result).toEqual('2.7 t');
  });

  test('Should respect trillions notation for numeral: convert comma to dot', () => {
    const result = prepareValue('2,7 t');
    expect(result).toEqual('2.7 t');
  });
});
