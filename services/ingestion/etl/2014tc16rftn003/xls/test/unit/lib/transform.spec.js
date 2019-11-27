/**
 * @jest-environment node
 */

import mapper from '../../../src/lib/transform';
import testRecord from '../../stubs/record.json';

describe('2014tc16rftn003 XLS transformer', () => {
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

  test('In field `third_parties`, respect countries of several words', () => {
    const copy = JSON.parse(JSON.stringify(testRecord));

    copy.Country =
      'FI Finland / SUOMI / FINLAND;UK United Kingdom / UNITED KINGDOM; NRC Not a real country / NONEXISTENT';
    const copyResult = mapper(copy);

    expect(copyResult.third_parties[0].country).toBe('Finland');
    expect(copyResult.third_parties[1].country).toBe('United Kingdom');
    expect(copyResult.third_parties[2].country).toBe('Not a real country');
  });
});
