/**
 * @jest-environment node
 */

import mapperESF from '../../../src/lib/transform/ESF/transform';
import mapperESIF from '../../../src/lib/transform/ESIF/transform';

import testRecordESF from '../../stubs/ESF/record';
import testRecordESIF from '../../stubs/ESIF/record';

describe('XLS transformers for 2014uk16rfop001', () => {
  let esf = {};
  let esif = {};

  beforeAll(() => {
    esf = mapperESF(testRecordESF);
    esif = mapperESIF(testRecordESIF);
  });

  test('Both types return null when record is not provided', () => {
    expect(mapperESF()).toBe(null);
    expect(mapperESIF()).toBe(null);
  });

  test('Type ESF: produces correct JSON output structure', () => {
    expect(esf).toMatchSnapshot();
  });
});
