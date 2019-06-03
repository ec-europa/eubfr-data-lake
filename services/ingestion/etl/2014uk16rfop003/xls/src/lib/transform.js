// @flow

import type { Project } from '@eubfr/types';
import sanitizeBudgetItem from '@eubfr/lib/budget/budgetFormatter';

/**
 * Preprocess `budget`.
 *
 * Input fields taken from the `record` are:
 * - `Total Paid Amount`
 *
 * @memberof 2014uk16rfop003XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Budget}
 */

const getBudget = record => ({
  total_cost: sanitizeBudgetItem({
    value: record['Total Paid Amount'],
    currency: 'GBP',
    raw: record['Total Paid Amount'],
  }),
  eu_contrib: sanitizeBudgetItem(),
  private_fund: sanitizeBudgetItem(),
  public_fund: sanitizeBudgetItem(),
  other_contrib: sanitizeBudgetItem(),
  funding_area: [],
  mmf_heading: '',
});

/**
 * Preprocess `project_id`.
 *
 * Input fields taken from the `record` are:
 * - `Ref. No`
 *
 * @memberof 2014uk16rfop003XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getProjectId = record => record['Ref. No'] || '';

/**
 * Preprocess `project_locations`.
 *
 * @memberof 2014uk16rfop003XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<Location>}
 */

const getLocations = record => [
  {
    address: '',
    centroid: null,
    country_code: 'GB', // Takes into account lib/getCountryCode.js rules directly.
    location: null,
    nuts: [],
    postal_code: record['Project Postcode']
      ? record['Project Postcode'].trim()
      : '',
    region: '',
    town: '',
  },
];

/**
 * Preprocess `third_parties`.
 *
 * Input fields taken from the `record` are:
 * - `Organisation Name`
 *
 * @memberof 2014uk16rfop003XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<ThirdParty>}
 */

const getThirdParties = record =>
  record['Organisation Name']
    ? [
        {
          address: '',
          country: 'GB',
          email: '',
          name: record['Organisation Name']
            ? record['Organisation Name'].trim()
            : '',
          phone: '',
          region: '',
          role: 'Lead organisation',
          type: '',
          website: '',
        },
      ]
    : [];

/**
 * Preprocess/format date.
 *
 * @memberof 2014uk16rfop003XlsTransform
 * @param {Date} date Date
 *
 * Supported formats:
 *
 * - `DD/MM/YYYY`
 *
 * @returns {Date} The date formatted into an ISO 8601 date format
 *
 */
const formatDate = date => {
  if (!date || typeof date !== 'string') return null;

  const d = date.split(/\//);
  if (d.length !== 3) return null;

  const [day, month, year] = d;

  if (!day || !month || !year) return null;

  try {
    return new Date(Date.UTC(year, month - 1, day)).toISOString();
  } catch (e) {
    return null;
  }
};

/**
 * Preprocess `timeframe`.
 *
 * Input fields taken from the `record` are:
 * - `Operation Start Date`
 * - `Operation End Date`
 *
 * @memberof 2014uk16rfop003XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Timeframe}
 */

const getTimeframe = record => {
  const from = formatDate(record['Operation Start Date']);
  const to = formatDate(record['Operation End Date']);

  return {
    from,
    from_precision: 'day',
    to,
    to_precision: 'day',
  };
};

/**
 * Preprocess `title`.
 *
 * Input fields taken from the `record` are:
 * - `Project Title`
 *
 * @memberof 2014uk16rfop003XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getTitle = record =>
  record['Project Title'] ? record['Project Title'].trim() : '';

/**
 * Map fields for 2014uk16rfop003 producer, XLS file types
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014uk16rfop003/xls/test/stubs/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014uk16rfop003/xls/src/lib/transform.js|implementation details}
 * @name 2014uk16rfop003XlsTransform
 * @param {Object} record Piece of data to transform before going to harmonized storage.
 * @returns {Project} JSON matching the type fields.
 */
export default (record: Object): Project | null => {
  if (!record) return null;

  // Map the fields
  return {
    action: '',
    budget: getBudget(record),
    call_year: '',
    description: '',
    ec_priorities: [],
    media: [],
    programme_name: '',
    project_id: getProjectId(record),
    project_locations: getLocations(record),
    project_website: '',
    complete: false,
    related_links: [],
    reporting_organisation: 'Member states',
    results: {
      available: '',
      result: '',
    },
    status: '',
    sub_programme_name: '',
    success_story: '',
    themes: [],
    third_parties: getThirdParties(record),
    timeframe: getTimeframe(record),
    title: getTitle(record),
    type: [],
  };
};
