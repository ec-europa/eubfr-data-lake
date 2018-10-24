// @flow

import sanitizeBudgetItem from '@eubfr/lib/budgetFormatter';
import getCountryCode from '@eubfr/lib/getCountryCode';
import type { Project } from '@eubfr/types';

/*
 * Transform message (DEVCO CSV)
 */

/**
 * Map fields for DEVCO producer, CSV file types
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/devco/csv/test/stubs/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/devco/csv/src/lib/transform.js|implementation details}
 * @name DevcoCsvTransform
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
    media: '',
    programme_name: '',
    project_id: '',
    project_locations: [],
    project_website: '',
    complete: true,
    related_links: [],
    reporting_organisation: 'DEVCO',
    results: {},
    status: '',
    sub_programme_name: '',
    success_story: '',
    themes: [],
    third_parties: [],
    timeframe: {
      from: '',
      from_precision: 'year',
      to: '',
      to_precision: 'year',
    },
    title: '',
    type: [],
  };
};
