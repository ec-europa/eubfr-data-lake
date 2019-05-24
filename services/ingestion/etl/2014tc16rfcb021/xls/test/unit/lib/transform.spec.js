/**
 * @jest-environment node
 */

import mapper from '../../../src/lib/transform';
import testRecord from '../../stubs/record.json';
import testRecordDates from '../../stubs/recordDates.json';

describe('2014tc16rfcb021 XLS transformer', () => {
  let result = {};
  let resultDates = {};

  beforeAll(() => {
    result = mapper(testRecord);
    resultDates = mapper(testRecordDates);
  });

  test('Returns null when record is not provided', () => {
    expect(mapper()).toBe(null);
  });

  test('Produces correct JSON output structure', () => {
    expect(result).toMatchSnapshot();
  });

  test('Produces correct JSON output in case of Dates in an ISO format', () => {
    expect(resultDates).toMatchSnapshot();
  });
});
