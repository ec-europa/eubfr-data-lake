/**
 * @jest-environment node
 */

import fs from 'fs';
import path from 'path';
import split2 from 'split2';
import getAvailableProperties from '../../../src/lib/getAvailableProperties';
import getCoverageReport from '../../../src/lib/getCoverageReport';

describe(`Helper getCoverageReport "@eubfr/ingestion-quality-analyzer" provides reports for number of occurences of a given field and its coverage`, () => {
  const transforms = [
    'agri/csv',
    'budg/xls',
    'iati/csv',
    'inforegio/json',
    'inforegio/xml',
    'valor/xls',
    'wifi4eu/xls',
  ];

  transforms.forEach(transform => {
    test(`Works with results of ${transform}`, () => {
      let numRecords = 0;
      const results = [];

      // In actual implementation this comes from s3 file meta.
      // Preserved in order to keep the structure of the results as close as possible to actual implementation.
      const fileMeta = {
        computed_key: 'foo',
        created_by: 'bar',
        last_modified: 'baz',
      };

      const file = path.resolve(
        `${__dirname}/../../stubs/${transform}/harmonized.ndjson`
      );

      const fileReadStream = fs.createReadStream(file);

      return new Promise((resolve, reject) => {
        fileReadStream
          .on('error', e => reject(e))
          .pipe(split2(JSON.parse))
          .on('data', record => {
            numRecords += 1;
            getAvailableProperties(record, results);
          })
          .on('finish', () => {
            const fieldStats = getCoverageReport(results, numRecords);
            const report = { meta: fileMeta, report: fieldStats };
            expect(report).toMatchSnapshot();
            resolve();
          });
      });
    });
  });
});
