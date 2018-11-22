/**
 * @jest-environment node
 */

import mapper from '../../../src/lib/transform';
import testRecord from '../../stubs/record.json';
import testRecord2 from '../../stubs/record2.json';
import testRecordFullYear from '../../stubs/record_full_year.json';

describe('DG EAC XLS transformer', () => {
  let yearTwoDigits = {};
  let typeWellFormated = {};
  let yearFourDigits = {};

  beforeAll(() => {
    yearTwoDigits = mapper(testRecord);
    typeWellFormated = mapper(testRecord2);
    yearFourDigits = mapper(testRecordFullYear);
  });

  test('Returns null when record is not provided', () => {
    expect(mapper()).toBe(null);
  });

  test('Produces correct JSON output structure, year in 2 digits', () => {
    expect(yearTwoDigits).toMatchSnapshot();
  });

  test('Produces correct JSON output structure, type array well formated', () => {
    expect(typeWellFormated).toMatchSnapshot();
  });

  test('Produces correct JSON output structure, year in 4 digits', () => {
    expect(yearFourDigits).toMatchSnapshot();
  });
});
