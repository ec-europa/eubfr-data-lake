/**
 * @jest-environment node
 */

import { enrich } from '../../../src/lib/enrich';
import existingRecord from './existingRecord.json';

describe('Enrichment module', () => {
  test('When empty objects: does not do anything', async () => {
    const result = await enrich({});
    expect(result).toMatchSnapshot();
  });

  test('When a record contains a foreign currency, try to convert it', async () => {
    const result = await enrich(existingRecord);
    expect(result).toMatchSnapshot();
  });
});
