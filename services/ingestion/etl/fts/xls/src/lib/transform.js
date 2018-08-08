// @flow

import sanitizeBudgetItem from '@eubfr/lib/budgetFormatter';
import getCountryCode from '@eubfr/lib/getCountryCode';
import type { Project } from '@eubfr/types';

/**
 * Map fields for FTS producer, XLS file types
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/fts/xls/test/stubs/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/fts/xls/src/lib/transform.js|implementation details}
 * @name FtsXlsTransform
 * @param {Object} record Piece of data to transform before going to harmonized storage.
 * @returns {Project} JSON matching the type fields.
 */
export default (record: Object): Project | null => {
  if (!record) return null;

  // Map the fields
  return {
    action: '',
    budget: {},
    call_year: '',
    description: '',
    ec_priorities: [],
    media: [],
    programme_name: '',
    project_id: '',
    project_locations: [],
    project_website: '',
    complete: true,
    related_links: [],
    reporting_organisation: 'BUDG',
    results: {},
    status: '',
    sub_programme_name: '',
    success_story: '',
    themes: [],
    third_parties: [],
    timeframe: {
      from: '',
      from_precision: 'day',
      to: '',
      to_precision: 'day',
    },
    title: '',
    type: [],
  };
};
