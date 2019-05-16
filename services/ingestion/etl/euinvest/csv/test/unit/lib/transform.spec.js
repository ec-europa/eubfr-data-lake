/**
 * @jest-environment node
 */

import mapper from '../../../src/lib/transform';
import testRecord from '../../stubs/record.json';

describe('EU Invest CSV transformer', () => {
  let result = {};

  beforeAll(() => {
    result = mapper(testRecord);
  });

  test('Returns null when record is not provided', () => {
    expect(mapper()).toBe(null);
  });

  test('Produces correct JSON output structure', () => {
    expect(result).toMatchSnapshot();
  });

  test('Field project_locations can work with a list of values which do not contain regions', () => {
    // Make a change in the copy, no need for another stub for testing a specific field.
    const copy = JSON.parse(JSON.stringify(testRecord));
    copy._location = ' , HU; , CZ; , IT; , AT; , PL';
    const resultCopy = mapper(copy);
    expect(resultCopy.project_locations.length).toBe(5);
    expect(resultCopy.project_locations[0].country_code).toBe('HU');
    expect(resultCopy.project_locations[4].country_code).toBe('PL');
  });
});
