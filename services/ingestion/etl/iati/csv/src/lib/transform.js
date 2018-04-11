// @flow

import getCountryCode from '../../../../../helpers/getCountryCode';

/*
 * Transform message (IATI CSV)
 */

import type { Project } from '../../../../_types/Project';

/**
 * Converts a single string to an array
 *
 * Fields taken into account from raw data:
 * - currency
 * - total-Commitment
 * - total-Disbursement
 * - total-Expenditure
 *
 * @memberof IatiCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Budget} Field containing {BudgetItem}
 *
 */
const getBudget = record => {
  const currency = record.currency || '';
  const raw = record['total-Commitment'] || '';

  return {
    eu_contrib: {
      value: 0,
      currency,
      raw,
    },
    total_cost: { value: 0, currency: '', raw: '' },
    private_fund: { value: 0, currency: '', raw: '' },
    public_fund: { value: 0, currency: '', raw: '' },
    other_contrib: { value: 0, currency: '', raw: '' },
    funding_area: [],
    mmf_heading: '',
  };
};

/**
 * Preprocess `project_locations` field.
 * Depends on:
 * - `getCountryCode`
 *
 * Data comes from the following source fields:
 * - `country_code`
 * - `region`
 *
 * @memberof IatiCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<Location>}
 */
const getLocations = record => [
  {
    address: '',
    centroid: null,
    country_code: getCountryCode(record['recipient-country-code']),
    location: null,
    nuts: [],
    postal_code: record['postal code'] || '',
    region: record['recipient-region-code'] || '',
    town: '',
  },
];

/**
 * Map fields for IATI producer, CSV file types
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/iati/csv/test/stubs/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/iati/csv/src/lib/transform.js|implementation details}
 * @name IatiCsvTransform
 * @param {Object} record Piece of data to transform before going to harmonized storage.
 * @returns {Project} JSON matching the type fields.
 */
export default (record: Object): Project => {
  // For taking a stub
  console.log(JSON.stringify(record));

  // Map the fields
  return {
    action: '',
    budget: getBudget(record),
    call_year: '',
    description: record.description || '',
    ec_priorities: '',
    media: {
      cover_image: '',
      video: '',
    },
    programme_name: '',
    project_id: '',
    project_locations: getLocations(record),
    project_website: '',
    related_links: [],
    results: {},
    status: '',
    sub_programme_name: '',
    success_story: '',
    themes: [],
    third_parties: [],
    timeframe: {
      from: '',
      to: '',
    },
    title: '',
    type: [],
  };
};
