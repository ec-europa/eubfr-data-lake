/**
 * @jest-environment node
 */

import path from 'path';
import transforms from '../../transforms';
import getAvailableProperties from '../../../src/lib/getAvailableProperties';

describe(`Helper getAvailableProperties "@eubfr/ingestion-quality-analyzer" works for any existing transform`, () => {
  transforms.forEach(transform => {
    test(`Works with results of ${transform}`, () => {
      const results = [];

      // eslint-disable-next-line
      const record = require(path.resolve(
        `${__dirname}/../../stubs/${transform}/record.json`
      ));

      getAvailableProperties(record, results);

      expect(results).toMatchSnapshot();
    });
  });
});
