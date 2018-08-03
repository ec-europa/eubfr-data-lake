/**
 * @jest-environment node
 */

import mapper from '../../../src/lib/transform';
import record from '../../stubs/record.json';

describe('DG HOME XLS transformer', () => {
  let result = {};

  beforeAll(() => {
    result = mapper(record);
  });

  test('Returns null when record is not provided', () => {
    expect(mapper()).toBe(null);
  });

  test('Produces correct JSON output structure', () => {
    expect(result).toMatchSnapshot();
  });
});
