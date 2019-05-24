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

  test('Formats dates only if in the form of DD.MM.YYYY', () => {
    // Make a change in the copy, no need for another stub for testing a specific field.
    const copy = JSON.parse(JSON.stringify(testRecord));
    // Change one of the dates to not be of "DD.MM.YYYY", there shouldn't be any change in the output.
    copy['End date'] = '2018-11-28T21:00:00.000Z';
    const resultCopy = mapper(copy);
    expect(resultCopy.timeframe.from).toBe('2016-02-03T00:00:00.000Z');
    expect(resultCopy.timeframe.to).toBe('2018-11-28T21:00:00.000Z');
  });

  test('Produces correct JSON output in case of Dates in an ISO format', () => {
    console.log(resultDates);
    expect(resultDates).toMatchSnapshot();
  });
});
