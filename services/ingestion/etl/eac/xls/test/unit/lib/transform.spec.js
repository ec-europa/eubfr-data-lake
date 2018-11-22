/**
 * @jest-environment node
 */

import mapper from '../../../src/lib/transform';
import testRecord from '../../stubs/record.json';
import testRecord2 from '../../stubs/record2.json';
import testRecordFullYear from '../../stubs/record_full_year.json';
import testRecordCulture20072013ProjectsOverview from '../../stubs/record_Culture_2007_2013_Projects_Overview.json';

describe('DG EAC XLS transformer', () => {
  let yearTwoDigits = {};
  let typeWellFormated = {};
  let yearFourDigits = {};
  let cultureProjectsOverview = {};

  beforeAll(() => {
    yearTwoDigits = mapper(testRecord);
    typeWellFormated = mapper(testRecord2);
    yearFourDigits = mapper(testRecordFullYear);
    cultureProjectsOverview = mapper(testRecordCulture20072013ProjectsOverview);
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

  test('Produces correct JSON output structure, given Culture_2007_2013_Projects_Overview_2018-11-22 file from http://ec.europa.eu/programmes/creative-europe/projects/ce-projects-compendium/', () => {
    expect(cultureProjectsOverview).toMatchSnapshot();
  });
});
