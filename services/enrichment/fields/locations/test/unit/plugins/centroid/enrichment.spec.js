/**
 * @jest-environment node
 */

import plugin from '../../../../src/plugins/centroid';
import location from './location.json';

describe('Centroid enrichment plugin: depending on the following input', () => {
  test('Empty object: returns same object, untouched, no errors', async () => {
    const loc = {};
    const result = await plugin(loc);
    expect(result).toMatchSnapshot();
  });

  // eslint-disable-next-line
  test.skip('Object with a centroid property containing latidude and logitude: returns a new object with NUTS data', async () => {
    const loc = JSON.parse(JSON.stringify(location));
    const result = await plugin(loc);
    expect(result).toMatchSnapshot();
  });

  // eslint-disable-next-line
  test.skip('Object with centroid property containing latidude and logitude, but no country_code, take country_code from NUTS', async () => {
    const loc = Object.assign({}, location, {
      country_code: '',
    });
    const result = await plugin(loc);
    expect(result).toMatchSnapshot();
  });
});
