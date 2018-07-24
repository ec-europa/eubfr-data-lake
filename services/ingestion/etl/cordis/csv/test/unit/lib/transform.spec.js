/**
 * @jest-environment node
 */

import mapper from '../../../src/lib/transform';
import testRecord from '../../stubs/record.json';

describe(`DG CORDIS CSV transformer`, () => {
  let result = {};

  beforeAll(() => {
    result = mapper(testRecord);
  });

  test(`Throws an error on empty input`, () => {
    expect(mapper).toThrow();
  });

  test(`Produces correct JSON output structure`, () => {
    expect(result).toMatchSnapshot();
  });

  test(`Project location information is correctly mapped`, () => {
    const firstLocation = result.project_locations[0];
    expect(firstLocation).toMatchSnapshot();
  });
});
