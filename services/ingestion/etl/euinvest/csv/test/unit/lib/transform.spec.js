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

  test('Field project_locations: can handle multiple regions', () => {
    // Make a change in the copy, no need for another stub for testing a specific field.
    const copy = JSON.parse(JSON.stringify(testRecord));
    copy._location = 'Emmendingen, Baden-Württemberg , DE';
    const resultCopy = mapper(copy);

    expect(resultCopy.project_locations.length).toBe(2);
    // Regions are handled separately.
    expect(resultCopy.project_locations[0].region).toBe('Emmendingen');
    expect(resultCopy.project_locations[1].region).toBe('Baden-Württemberg');
    // Country codes are the same though.Baden-Württemberg
    expect(resultCopy.project_locations[0].country_code).toBe('DE');
    expect(resultCopy.project_locations[1].country_code).toBe('DE');
  });

  test('Field project_locations: can handle multiple regions separated by a slash', () => {
    // Make a change in the copy, no need for another stub for testing a specific field.
    const copy = JSON.parse(JSON.stringify(testRecord));
    copy._location = 'Albstadt - Tailfingen / Baden - Württemberg, DE;';
    const resultCopy = mapper(copy);

    expect(resultCopy.project_locations.length).toBe(2);
    // Regions are handled separately.
    expect(resultCopy.project_locations[0].region).toBe(
      'Albstadt - Tailfingen'
    );
    expect(resultCopy.project_locations[1].region).toBe('Baden - Württemberg');
    // Country codes are the same though.
    expect(resultCopy.project_locations[0].country_code).toBe('DE');
    expect(resultCopy.project_locations[1].country_code).toBe('DE');
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
