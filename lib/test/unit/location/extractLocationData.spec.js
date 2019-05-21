/**
 * @jest-environment node
 */

const extractLocationData = require('../../../location/extractLocationData');

describe('extractLocationData helper', () => {
  test('Should return an empty object when no arguments', () => {
    const result = extractLocationData();
    expect(result).toEqual({});
  });

  test('Should contain original input in a property called "raw"', () => {
    const result = extractLocationData('foo');
    expect(result.raw).toBe('foo');
  });

  test('No matches: blueprint fields regions" and "towns" are empty, defaults to fill "countryCodes"', () => {
    const result = extractLocationData('foo');
    expect(result.countryCodes).toEqual(['foo']);
    expect(result.regions).toEqual([]);
    expect(result.towns).toEqual([]);
  });

  test('Matches: can handle cases when only country codes are provided', () => {
    const result = extractLocationData(' , HU; , CZ; , IT; , AT; , PL');

    expect(result.countryCodes.length).toBe(5);
    // Verfy order as well.
    expect(result.countryCodes[0]).toBe('HU');
    expect(result.countryCodes[4]).toBe('PL');
  });

  test('Matches: only country codes', () => {
    const result = extractLocationData(' , HU; , CZ; , IT; , AT; , PL');

    expect(result.countryCodes.length).toBe(5);
    // Verfy order as well.
    expect(result.countryCodes[0]).toBe('HU');
    expect(result.countryCodes[4]).toBe('PL');
  });

  test('Matches: town and region, separated by a comma', () => {
    const result = extractLocationData('Emmendingen, Baden-Württemberg , DE');
    expect(result.countryCodes.length).toBe(1);
    expect(result.countryCodes[0]).toBe('DE');
    expect(result.towns.length).toBe(1);
    expect(result.towns[0]).toBe('Emmendingen');
    expect(result.regions.length).toBe(1);
    expect(result.regions[0]).toBe('Baden-Württemberg');
  });

  test('Matches: town and region, separated by a slash', () => {
    const result = extractLocationData(
      'Albstadt - Tailfingen / Baden - Württemberg, DE;'
    );
    expect(result.countryCodes.length).toBe(1);
    expect(result.countryCodes[0]).toBe('DE');
    expect(result.towns.length).toBe(1);
    expect(result.towns[0]).toBe('Albstadt - Tailfingen');
    expect(result.regions.length).toBe(1);
    expect(result.regions[0]).toBe('Baden - Württemberg');
  });
});
