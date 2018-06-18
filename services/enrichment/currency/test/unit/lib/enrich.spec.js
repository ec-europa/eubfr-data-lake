/**
 * @jest-environment node
 */

import { enrich } from '../../../src/lib/enrich';
import r1 from './record.json';
import r2 from './existingRecord.json';

describe('Enrichment module', () => {
  test('When empty objects: does not do anything', async () => {
    const newRecord = {};
    const existingRecord = {};
    const result = await enrich(newRecord, existingRecord);
    expect(result).toMatchSnapshot();
  });

  test('When two records contain project_locations field and are to be merged', async () => {
    const newRecord = JSON.parse(JSON.stringify(r1));
    const existingRecord = JSON.parse(JSON.stringify(r2));

    const result = await enrich(newRecord, existingRecord);
    expect(result).toMatchSnapshot();
  });
});