/**
 * @jest-environment node
 */

import plugin from '../../../../src/plugins/country';
import location from './location.json';

describe('Country enrichment plugin: depending on the following input', () => {
  test('Empty object: returns same object, untouched, no errors', async () => {
    const loc = {};
    const result = await plugin(loc);
    expect(result).toMatchSnapshot();
  });

  test('Object with a country_code property: returns a new object centroid data', async () => {
    const loc = JSON.parse(JSON.stringify(location));
    const result = await plugin(loc);
    expect(result).toMatchSnapshot();
  });
});
