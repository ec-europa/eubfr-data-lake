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

  test('When two records contain project_locations field and are to be merged', async () => {
    const result = await enrich(existingRecord);
    expect(result).toMatchSnapshot();
  });
});
