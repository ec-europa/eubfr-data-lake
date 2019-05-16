// @flow

import crypto from 'crypto';
import {
  sanitizeBudgetItem,
  sanitizeValue,
} from '@eubfr/lib/budget/budgetFormatter';
import getCountryCode from '@eubfr/lib/getCountryCode';
import type { Project } from '@eubfr/types';

/*
 * Transform message (IATI CSV)
 */

/**
 * Makes use of both `total-Disbursement` and `total-Expenditure` fields when present.
 *
 * Fields taken into account from raw data:
 * - currency
 * - total-Disbursement
 * - total-Expenditure
 *
 * @memberof IatiCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Budget} Field containing {BudgetItem}
 *
 */
const getBudget = record => {
  let euContrib = {};

  if (record) {
    const { currency } = record;
    const totalDisbursementValue = sanitizeValue(record['total-Disbursement']);
    const totalExpenditureValue = sanitizeValue(record['total-Expenditure']);

    const value = totalDisbursementValue + totalExpenditureValue;
    const raw = currency && value ? `${currency} ${value}` : '';

    // Assign values
    euContrib = {
      value: Math.floor(value),
      currency,
      raw,
    };
  }

  return {
    eu_contrib: sanitizeBudgetItem(euContrib),
    total_cost: sanitizeBudgetItem(),
    private_fund: sanitizeBudgetItem(),
    public_fund: sanitizeBudgetItem(),
    other_contrib: sanitizeBudgetItem(),
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
 *
 * @memberof IatiCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<Location>}
 */
const getLocations = record =>
  record['recipient-country-code']
    ? [
        {
          address: '',
          centroid: null,
          country_code: getCountryCode(record['recipient-country-code']),
          location: null,
          nuts: [],
          postal_code: '',
          region: '',
          town: '',
        },
      ]
    : [];

/**
 * Prepares information for `reporting_organisation` field.
 * Depends on:
 * - `reporting-org-ref`
 *
 * @memberof IatiCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String} Abbreviation a given reporting DG.
 */
const getReportingOrganizations = record => {
  if (!record['reporting-org-ref']) return 'DEVCO';
  const match = /XI-IATI-EC_(.*)/.exec(record['reporting-org-ref']);
  if (match && match.length) {
    // The abbreviation:
    return match[1];
  }
  return 'DEVCO';
};

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
export default (record: Object): Project | null => {
  if (!record) return null;

  return {
    action: '',
    budget: getBudget(record),
    call_year: '',
    description: record.description || '',
    ec_priorities: [],
    media: [],
    programme_name: '',
    project_id: getProjectId(record),
    project_locations: getLocations(record),
    project_website: '',
    complete: false,
    related_links: [],
    reporting_organisation: getReportingOrganizations(record),
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
      from_precision: 'day',
      to: formatDate(record['end-actual']),
      to_precision: 'day',
    },
    title: record.title || '',
    type: [],
  };
};
