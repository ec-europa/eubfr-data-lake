/**
 * @jest-environment node
 */

import mapper from '../../../src/lib/transform';
import testRecord from '../../stubs/record.json';
import testRecord1 from '../../stubs/recordLocations1';
import testRecord2 from '../../stubs/recordLocations2';
import testRecord3 from '../../stubs/recordLocations3';
import testRecord4 from '../../stubs/recordCoordinator';

describe('EU Invest CSV transformer', () => {
  let result = {};
  let result1 = {};
  let result2 = {};
  let result3 = {};
  let result4 = {};

  beforeAll(() => {
    result = mapper(testRecord);
    result1 = mapper(testRecord1);
    result2 = mapper(testRecord2);
    result3 = mapper(testRecord3);
    result4 = mapper(testRecord4);
  });

  test('Returns null when record is not provided', () => {
    expect(mapper()).toBe(null);
  });

  test('Produces correct JSON output structure', () => {
    expect(result).toMatchSnapshot();
  });

  test('Budget values do not contain decimals', () => {
    expect(result.budget.eu_contrib.value % 1).toBe(0);
    expect(result.budget.total_cost.value % 1).toBe(0);
  });

  test('Field project_locations: can work with a list of values which do not contain regions', () => {
    // Make a change in the copy, no need for another stub for testing a specific field.
    const copy = JSON.parse(JSON.stringify(testRecord));
    copy._location = ' , HU; , CZ; , IT; , AT; , PL';
    const resultCopy = mapper(copy);
    // Check all codes are handles.
    expect(resultCopy.project_locations.length).toBe(5);
    // Verfy order as well.
    expect(resultCopy.project_locations[0].country_code).toBe('HU');
    expect(resultCopy.project_locations[4].country_code).toBe('PL');
  });

  test('Snapshot project_locations: can work with a list of values which do not contain regions', () => {
    expect(result1).toMatchSnapshot();
  });

  test('Field project_locations: can handle a region and a town, separated by a comma', () => {
    // Make a change in the copy, no need for another stub for testing a specific field.
    const copy = JSON.parse(JSON.stringify(testRecord));
    copy._location = 'Emmendingen, Baden-Württemberg , DE';
    const resultCopy = mapper(copy);

    expect(resultCopy.project_locations.length).toBe(1);
    expect(resultCopy.project_locations[0].town).toBe('Emmendingen');
    expect(resultCopy.project_locations[0].region).toBe('Baden-Württemberg');
    expect(resultCopy.project_locations[0].country_code).toBe('DE');
  });

  test('Snapshot project_locations: can handle a region and a town, separated by a comma', () => {
    expect(result2).toMatchSnapshot();
  });

  test('Field project_locations: can handle a region and a town, separated by a slash', () => {
    // Make a change in the copy, no need for another stub for testing a specific field.
    const copy = JSON.parse(JSON.stringify(testRecord));
    copy._location = 'Albstadt - Tailfingen / Baden - Württemberg, DE;';
    const resultCopy = mapper(copy);

    expect(resultCopy.project_locations.length).toBe(1);
    // Regions are handled separately.
    expect(resultCopy.project_locations[0].town).toBe('Albstadt - Tailfingen');
    expect(resultCopy.project_locations[0].region).toBe('Baden - Württemberg');
    // Country codes are the same though.
    expect(resultCopy.project_locations[0].country_code).toBe('DE');
  });

  test('Snapshot project_locations: can handle a region and a town, separated by a slash', () => {
    expect(result3).toMatchSnapshot();
  });

  test('Field third_parties: do not take into account N/A entries for the coordinator', () => {
    // Make a change in the copy, no need for another stub for testing a specific field.
    const copy = JSON.parse(JSON.stringify(testRecord));
    copy._coordinator = 'N/A';
    const resultCopy = mapper(copy);

    const badItem = resultCopy.third_parties.findIndex(
      actor => actor.name === 'N/A'
    );
    expect(badItem).toBe(-1);
  });

  test('Snapshot third_parties: do not take into account N/A entries for the coordinator', () => {
    expect(result4).toMatchSnapshot();
  });

  test('Field third_parties: do not take into account N/A entries for partners', () => {
    // Make a change in the copy, no need for another stub for testing a specific field.
    const copy = JSON.parse(JSON.stringify(testRecord));
    copy._partners = 'N/A';
    const resultCopy = mapper(copy);

    const badItem = resultCopy.third_parties.findIndex(
      actor => actor.name === 'N/A'
    );
    expect(badItem).toBe(-1);
  });
});
