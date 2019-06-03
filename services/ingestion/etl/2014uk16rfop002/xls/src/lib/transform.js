// @flow

import crypto from 'crypto';
import type { Project } from '@eubfr/types';
import sanitizeBudgetItem from '@eubfr/lib/budget/budgetFormatter';

/**
 * Preprocess `budget`.
 *
 * Input fields taken from the `record` are:
 * - `EU (£) (30%)`
 * - `EU (£)`
 * - `Total (£)`
 *
 * @memberof 2014uk16rfop002XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Budget}
 */

const getBudget = record => {
  const euContrib = record['EU (£) (30%)'] || record['EU (£)'];

  return {
    total_cost: sanitizeBudgetItem({
      value: record['Total (£)'],
      currency: 'GBP',
      raw: record['Total (£)'],
    }),
    eu_contrib: sanitizeBudgetItem({
      value: euContrib,
      currency: 'GBP',
      raw: euContrib,
    }),
    private_fund: sanitizeBudgetItem(),
    public_fund: sanitizeBudgetItem(),
    other_contrib: sanitizeBudgetItem(),
    funding_area: [],
    mmf_heading: '',
  };
};

/**
 * Preprocess `description`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Project No.`
 * - `GOG (£)`
 * - `PS (£)`
 * - `PS (£) (70%)`
 *
 * @memberof 2014uk16rfop002XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getDescription = record => {
  const fields = ['Project No.', 'GOG (£)', 'PS (£)'];
  let description = '';

  fields.forEach(field => {
    if (record[field]) {
      description += `${field}: ${record[field]} \n`;
    }
  });

  if (!description.includes('PS (£)') && record['PS (£) (70%)']) {
    description += `PS (£): ${record['PS (£) (70%)']}`;
  }

  return description;
};

/**
 * Preprocess `project_id`.
 *
 * Input fields taken from the `record` are:
 * - `Project Name`
 *
 * @memberof 2014uk16rfop002XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getProjectId = record =>
  record['Project Name']
    ? crypto
        .createHash('md5')
        .update(String(record['Project Name']))
        .digest('hex')
    : '';

/**
 * Preprocess `project_locations`.
 *
 * @memberof 2014uk16rfop002XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<Location>}
 */

const getLocations = () => [
  {
    address: '',
    centroid: null,
    country_code: 'GB', // Takes into account lib/getCountryCode.js rules directly.
    location: null,
    nuts: [],
    postal_code: '',
    region: '',
    town: '',
  },
];

/**
 * Preprocess `themes`.
 *
 * Input fields taken from the `record` are:
 * - `Activity`
 *
 * @memberof 2014uk16rfop002XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<String>}
 */

const getThemes = record =>
  record.Activity ? record.Activity.trim().split(/\s*(?:,|&)\s*/) : [];

/**
 * Preprocess `third_parties`.
 *
 * Input fields taken from the `record` are:
 * - `Sponsor`
 *
 * @memberof 2014uk16rfop002XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<ThirdParty>}
 */

const getThirdParties = record =>
  record.Sponsor
    ? [
        {
          address: '',
          country: 'GB',
          email: '',
          name: record.Sponsor ? record.Sponsor.trim() : '',
          phone: '',
          region: '',
          role: 'Sponsor',
          type: '',
          website: '',
        },
      ]
    : [];

/**
 * Preprocess `timeframe`.
 *
 * Input fields taken from the `record` are:
 * - `Start Date`
 * - `End Date`
 *
 * @memberof 2014uk16rfop002XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Timeframe}
 */

const getTimeframe = record => {
  const from = record['Start Date'] || null;
  const to = record['End Date'] || null;

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
 * - `Project Name`
 *
 * @memberof 2014uk16rfop002XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getTitle = record =>
  record['Project Name'] ? record['Project Name'].trim() : '';

/**
 * Map fields for 2014uk16rfop002 producer, XLS file types
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014uk16rfop002/xls/test/stubs/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014uk16rfop002/xls/src/lib/transform.js|implementation details}
 * @name 2014uk16rfop002XlsTransform
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
    description: getDescription(record),
    ec_priorities: [],
    media: [],
    programme_name: '',
    project_id: getProjectId(record),
    project_locations: getLocations(),
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
    themes: getThemes(record),
    third_parties: getThirdParties(record),
    timeframe: getTimeframe(record),
    title: getTitle(record),
    type: [],
  };
};
