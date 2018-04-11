// @flow

import crypto from 'crypto';
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
 * Generates values for `project_id` field since source data misses these.
 * It's needed for having separate projects in the Elasticsearch database.
 *
 * @memberof IatiCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getProjectId = record => {
  const title = record.title || '';
  return crypto
    .createHash('md5')
    .update(title)
    .digest('hex');
};

/**
 * Preprocess `project_locations` field.
 * Depends on:
 * - `getCountryCode`
 *
 * Data comes from the following source fields:
 * - `recipient-country-code`
 * - `recipient-region-code`
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
    postal_code: '',
    region: record['recipient-region-code'] || '',
    town: '',
  },
];

/**
 * Format date
 *
 * @memberof IatiCsvTransform
 * @param {Date} date Date in `YYYY-MM-DD` (ISO) format
 * @returns {Date} The date formatted into an ISO 8601 date format
 *
 * @example
 * input => "2018-12-31"
 * output => "2018-12-31T00:00:00.000Z"
 */
const formatDate = date => {
  if (!date || typeof date !== 'string') return null;

  try {
    return new Date(date).toISOString();
  } catch (e) {
    return null;
  }
};

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
export default (record: Object): Project =>
  // Map the fields
  ({
    action: '',
    budget: getBudget(record),
    call_year: '',
    description: record.description || '',
    ec_priorities: [],
    media: {
      cover_image: '',
      video: '',
    },
    programme_name: '',
    project_id: getProjectId(record),
    project_locations: getLocations(record),
    project_website: '',
    related_links: [],
    reporting_organisation: record['reporting-org'] || '',
    results: {
      available: '',
      result: '',
    },
    status: '',
    sub_programme_name: '',
    success_story: '',
    themes: [],
    third_parties: [],
    timeframe: {
      from: formatDate(record['start-actual']),
      to: formatDate(record['end-actual']),
    },
    title: record.title || '',
    type: [],
  });
