/**
 * @jest-environment node
 */

import plugin from '../../../../src/plugins/centroid';
import location from './location.json';

describe('Centroid enrichment plugin: empty object', () => {
  const loc = {};
  let result = {};

  beforeAll(async () => {
    result = await plugin(loc);
  });

  test('Returns empty object, untouched, no errors', () => {
    expect(result).toMatchSnapshot();
  });
});

describe('Centroid enrichment plugin: actual input', () => {
  const loc = location;
  let result = {};

  beforeAll(async () => {
    result = await plugin(loc);
  });

  test('Returns a new object with NUTs code', () => {
    expect(result).toMatchSnapshot();
  });
});
