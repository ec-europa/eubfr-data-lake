/**
 * @jest-environment node
 */

import path from 'path';
import getAvailableProperties from '../../../src/lib/getAvailableProperties';

describe(`Helper getAvailableProperties "@eubfr/ingestion-quality-analyzer" works for any existing transform`, () => {
  const transforms = [
    'agri-csv',
    // 'budg-xls',
    // 'iati-csv',
    // 'inforegio-json',
    // 'inforegio-xml',
    // 'valor-xls',
    // 'wifi4eu-xls',
  ];

  transforms.forEach(transform => {
    test(`Works with results of ${transform}`, () => {
      const results = [];
      const info = transform.split('-');
      const producer = info[0];
      const extension = info[1];

      // eslint-disable-next-line
      const record = require(path.resolve(
        `${__dirname}/../../stubs/${producer}/${extension}/record.json`
      ));

      getAvailableProperties(record, results);

      expect(results).toMatchSnapshot();
    });
  });
});
