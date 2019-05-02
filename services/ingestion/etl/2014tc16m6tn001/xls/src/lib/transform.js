// @flow

import crypto from 'crypto';
import sanitizeBudgetItem from '@eubfr/lib/budget/budgetFormatter';
import type { Project } from '@eubfr/types';

/**
 * Preprocess `budget`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Total eligible expenditure allocated to the operation`
 * - `Union co-financing rate in %`
 *
 * @memberof 2014tc16m6tn001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Budget}
 */

const getBudget = record => {
  const total = record['Total eligible expenditure allocated to the operation'];
  const rate = record['Union co-financing rate in %'];

  const euContrib = (total * rate) / 100;

  return {
    total_cost: sanitizeBudgetItem({
      value: total,
      currency: 'EUR',
      raw: record['Total eligible expenditure allocated to the operation'],
    }),
    eu_contrib: sanitizeBudgetItem({
      value: euContrib,
      currency: 'EUR',
      raw: record['Union co-financing rate in %'],
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
 * - `Programme & operation specific objective`
 * - `Priority axis`
 * - `Operation summary`
 *
 * @memberof 2014tc16m6tn001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array}
 */

const getDescription = record => {
  let description = '';

  const fields = [
    'Programme & operation specific objective',
    'Priority axis',
    'Operation summary',
  ];

  fields.forEach(field => {
    if (record[field]) {
      description += `${field}: ${record[field]} \n`;
    }
  });

  return description;
};

/**
 * Preprocess `project_id`.
 *
 * Input fields taken from the `record` are:
 * - `Operation name`
 *
 * @memberof 2014tc16m6tn001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getProjectId = record =>
  record['Operation name']
    ? crypto
        .createHash('md5')
        .update(String(record['Operation name']))
        .digest('hex')
    : '';

/**
 * Preprocess `themes`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Programme's investment priority / thematic priority`
 *
 * @memberof 2014tc16m6tn001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array}
 */

const getThemes = record =>
  record["Programme's investment priority / thematic priority"]
    ? [record["Programme's investment priority / thematic priority"]]
    : [];

/**
 * Preprocess `third_parties`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Beneficiary name`
 * - `Beneficiary name in English`
 * - `Has the lead of the operation (Y/N)`
 *
 * @memberof 2014tc16m6tn001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<ThirdParty>}
 */

const getThirdParties = record => {
  const thirdParties = [];
  const actor = {
    address: '',
    country: '',
    email: '',
    name: `${record['Beneficiary name in English']} (${
      record['Beneficiary name']
    })`,
    phone: '',
    role: '',
    region: '',
    type: '',
    website: '',
  };

  if (record['Has the lead of the operation (Y/N)'] === 'Y') {
    actor.role = 'coordinator';
  } else {
    actor.role = 'partner';
  }

  thirdParties.push(actor);

  return thirdParties;
};

/**
 * Preprocess/format date.
 *
 * @memberof 2014tc16m6tn001XlsTransform
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
 *
 * - `Operation start date`
 * - `Operation end date`
 *
 * @memberof 2014tc16m6tn001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Timeframe}
 */

const getTimeframe = record => {
  const from = record['Operation start date']
    ? formatDate(record['Operation start date'])
    : null;
  const to = record['Operation end date']
    ? formatDate(record['Operation end date'])
    : null;

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
 *
 * - `Operation name`
 *
 * @memberof 2014tc16m6tn001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getTitle = record =>
  record['Operation name'] ? record['Operation name'].trim() : '';

/**
 * Map fields for 2014tc16m6tn001 producer, XLS file types
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014tc16m6tn001/xls/test/stubs/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014tc16m6tn001/xls/src/lib/transform.js|implementation details}
 * @name 2014tc16m6tn001XlsTransform
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
    project_locations: [],
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
