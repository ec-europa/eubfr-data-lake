/**
 * @jest-environment node
 */

import mapper from '../../../src/lib/transform';
import testRecord from '../../stubs/record.json';

describe(`DG INFOREGIO XLS transformer`, () => {
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
});
