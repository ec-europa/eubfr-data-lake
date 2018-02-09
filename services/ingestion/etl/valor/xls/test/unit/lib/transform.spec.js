/**
 * @jest-environment node
 */

import mapper from '../../../src/lib/transform';
import testRecord from '../../stubs/record.json';
import testRecordFullYear from '../../stubs/record_full_year.json';

describe(`VALOR XLS transformer`, () => {
  let yearTwoDigits = {};
  let yearFourDigits = {};

  beforeAll(() => {
    yearTwoDigits = mapper(testRecord);
    yearFourDigits = mapper(testRecordFullYear);
  });

  test(`Throws an error on empty input`, () => {
    expect(mapper).toThrow();
  });

  test(`Produces correct JSON output structure, year in 2 digits`, () => {
    expect(yearTwoDigits).toMatchSnapshot();
  });

  test(`Produces correct JSON output structure, year in 4 digits`, () => {
    expect(yearFourDigits).toMatchSnapshot();
  });
});
