/**
 * @jest-environment node
 */

import mapper from '../../../src/lib/transform';
import testRecord from '../../stubs/record.json';
import testRecord2 from '../../stubs/record2.json';
import testRecordReferenceId from '../../stubs/recordReference.json';
// Lastly, FP4 has unique fields compared to the rest.
import testRecordFP4 from '../../stubs/recordFP4.json';

describe('DG CORDIS CSV transformer', () => {
  let result = {};
  let resultMultiple = {};
  let resultReferenceId = {};
  let resultRecordFP4Transformed = {};

  beforeAll(() => {
    result = mapper(testRecord);
    resultMultiple = mapper(testRecord2);
    resultReferenceId = mapper(testRecordReferenceId);
    resultRecordFP4Transformed = mapper(testRecordFP4);
  });

  test('Returns null when record is not provided', () => {
    expect(mapper()).toBe(null);
  });

  test('Produces correct JSON output structure', () => {
    expect(result).toMatchSnapshot();
  });

  test('Budget values do not contain decimals', () => {
    expect(result.budget.eu_contrib.value % 1).toBe(0);
    expect(result.budget.total_cost.value % 1).toBe(0);
  });

  test('Can handle multi-value inputs for participants and coordinators', () => {
    expect(resultMultiple).toMatchSnapshot();
  });

  test('Can handle records which contain project_id in field called reference instead of an id', () => {
    // FP before 5 are with `reference`, whereas newer FPs are with `id`.
    expect(resultReferenceId).toMatchSnapshot();
  });

  test('Can handle FP4', () => {
    expect(resultRecordFP4Transformed).toMatchSnapshot();
  });

  test('Can handle 2 types of dates: `YYYY-MM-DD` and `DD/MM/YYYY`', () => {
    // Newer FPs are `YYYY-MM-DD`:
    expect(result.timeframe.from).toEqual('2018-11-01T00:00:00.000Z');
    // Older FPs are `DD/MM/YYYY`:
    expect(resultReferenceId.timeframe.from).toEqual(
      '1986-01-01T00:00:00.000Z'
    );
  });
});
