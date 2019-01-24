/**
 * @jest-environment node
 */

const ensureExtensions = require('../../../etl/ensureExtensions');

describe('ensureExtensions helper', () => {
  test('Check single extension: CSV', () => {
    const file = 'foo.csv';
    const extensions = ['.csv'];
    const result = ensureExtensions({ file, extensions });
    expect(result).toBe(true);
  });

  test('Check single extension: CSV given when XLS expected', () => {
    const file = 'foo.csv';
    const extensions = ['.xls'];
    const result = ensureExtensions({ file, extensions });
    expect(result).toBe(false);
  });

  test('Multiple extensions: XLS and XLSX, XLS input', () => {
    const file = 'foo.xls';
    const extensions = ['.xls', '.xlsx'];
    const result = ensureExtensions({ file, extensions });
    expect(result).toBe(true);
  });

  test('Multiple extensions: XLS and XLSX, XLSX input', () => {
    const file = 'foo.xlsx';
    const extensions = ['.xls', '.xlsx'];
    const result = ensureExtensions({ file, extensions });
    expect(result).toBe(true);
  });

  test('Multiple extensions: XLS and XLSX, CSV input', () => {
    const file = 'foo.csv';
    const extensions = ['.xls', '.xlsx'];
    const result = ensureExtensions({ file, extensions });
    expect(result).toBe(false);
  });
});
