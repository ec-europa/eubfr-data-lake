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

  test('Case: blueprint fields "regions" and "towns" are empty, defaults to "countryCodes"', () => {
    const result = extractLocationData('foo');
    expect(result.countryCodes).toEqual(['foo']);
    expect(result.regions).toEqual([]);
    expect(result.towns).toEqual([]);
  });

  test('Case: only country codes', () => {
    const result = extractLocationData(' , HU; , CZ; , IT; , AT; , PL');

    expect(result.countryCodes.length).toBe(5);
    // Verfy order as well.
    expect(result.countryCodes[0]).toBe('HU');
    expect(result.countryCodes[4]).toBe('PL');
  });

  test('Case: town and region, separated by a comma', () => {
    const result = extractLocationData('Emmendingen, Baden-Württemberg , DE');
    expect(result.countryCodes.length).toBe(1);
    expect(result.countryCodes[0]).toBe('DE');
    expect(result.towns.length).toBe(1);
    expect(result.towns[0]).toBe('Emmendingen');
    expect(result.regions.length).toBe(1);
    expect(result.regions[0]).toBe('Baden-Württemberg');
  });

  test('Case: town and region, separated by a slash', () => {
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

  test('Case: town without a region', () => {
    const result = extractLocationData('Paris , FR');
    expect(result.towns[0]).toBe('Paris');
    expect(result.countryCodes[0]).toBe('FR');
  });

  test('Case: regions by "and" keyword', () => {
    const result = extractLocationData('Aisne, Drôme and Haute-Saône , FR');
    expect(result.regions.length).toBe(3);
    expect(result.countryCodes[0]).toBe('FR');
  });

  test('Case: regions by a comma and "and" keyword', () => {
    const result = extractLocationData(
      'Msida, Birkirkara, Balzan, Gżira, Qormi, Marsa, Żebbuġ, Marsascala and Żabbar , MT'
    );
    expect(result.regions.length).toBe(9);
    expect(result.countryCodes[0]).toBe('MT');
  });

  test('Case: multiple towns and countries', () => {
    const result = extractLocationData(
      'Andalusia , ES;Glasgow , UK;Bremen , DE;Leeuwarden , NL'
    );
    expect(result.towns.length).toBe(4);
    expect(result.countryCodes.length).toBe(4);
    expect(result.towns[0]).toBe('Andalusia');
    expect(result.countryCodes[0]).toBe('ES');
  });

  test('Case: multiple regions and countries', () => {
    const result = extractLocationData(
      'Andalusia , ES;Glasgow , UK;Bremen , DE;Leeuwarden , NL'
    );
    expect(result.towns.length).toBe(4);
    expect(result.countryCodes.length).toBe(4);
    expect(result.towns[0]).toBe('Andalusia');
    expect(result.countryCodes[0]).toBe('ES');
  });

  test('Case: ignores a set of keywords which are not actual locations', () => {
    const result = extractLocationData(
      '47 schools, 116 sites, 11 regions, 56 departments, 4 overseas , FR'
    );
    expect(result.towns.length).toBe(0);
    expect(result.regions.length).toBe(0);
    expect(result.countryCodes.length).toBe(1);
  });

  test('Case: location items contain different sets of information', () => {
    const result = extractLocationData(
      'Kontich, Antwerpen , BE;Esch-sur-Alzette , LU'
    );
    expect(result.towns.length).toBe(2);
    expect(result.regions.length).toBe(1);
  });
});
