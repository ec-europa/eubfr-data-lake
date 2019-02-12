/**
 * @jest-environment node
 */

import mapper from '../../../src/lib/transform';
import testRecord from '../../stubs/record.json';

describe('EU Results CSV transformer', () => {
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

  test('Project location information is correctly mapped', () => {
    const firstLocation = result.project_locations[0];
    expect(firstLocation).toMatchSnapshot();
  });
});

describe('EU Results transformer handling incomplete or inconsistent data', () => {
  const partialRecord = {
    Name: 'Bulgaria’s capital expands metro network',
    'Timeframe start': '1388530800',
    'Timeframe end': '1420066800',
    'Project location latitude': '42.73806663',
    'Project location longitude': '23.40014509',
    'Project country(ies)': '',
    'EC’s priorities': '',
    Coordinators: '',
    Partners: '',
    'Related links': '',
  };

  test('Certain fields should always be present after transformation', () => {
    const partialResult = mapper(partialRecord);
    expect(partialResult).toMatchSnapshot();
  });
});
