// @flow

import crypto from 'crypto';
import type { Project } from '@eubfr/types';
import sanitizeBudgetItem from '@eubfr/lib/budget/budgetFormatter';
import numeral from 'numeral';

/**
 * Preprocess `budget`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Total Project Cost (€/£)`
 * - `Union Co-Financing Rate %`
 *
 * @memberof 2014tc16rfcb014CsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Budget}
 */

const getBudget = record => {
  const { _value: total } = numeral(record['Total Project Cost (€/£)']);
  const { _value: percentage } = numeral(record['Union Co-Financing Rate %']);
  const euContrib = (total * percentage) / 100;

  return {
    total_cost: sanitizeBudgetItem({
      value: total,
      currency: 'EUR',
      raw: record['Total Project Cost (€/£)'],
    }),
    eu_contrib: sanitizeBudgetItem({
      value: euContrib,
      currency: 'EUR',
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
 * - `Theme`
 * - `eMS Ref`
 * - `Operation/Project Summary`
 * - `Committed Outputs`
 * - `Total ERDF + Match (€/£)`
 * - `Total ERDF Allocated (€/£)`
 * - `Category of Intervention`
 *
 * @memberof 2014tc16rfcb014CsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getDescription = record => {
  let description = '';

  const fields = [
    'Theme',
    'eMS Ref',
    'Operation/Project Summary',
    'Committed Outputs',
    'Total ERDF + Match (€/£)',
    'Total ERDF Allocated (€/£)',
    'Category of Intervention',
  ];

  fields.forEach(field => {
    description += `${field}: ${record[field]}\n`;
  });

  return description;
};

/**
 * Preprocess `project_id`.
 *
 * Input fields taken from the `record` are:
 * - `Operation/Project Name`
 *
 * @memberof 2014tc16rfcb014CsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getProjectId = record =>
  crypto
    .createHash('md5')
    .update(record['Operation/Project Name'])
    .digest('hex');

/**
 * Preprocess `project_locations`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Operation Postcode`
 * - `Country`
 *
 * @memberof 2014tc16rfcb014CsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<Location>}
 */

const getLocations = record => {
  const locations = [];
  const postCode = record['Operation Postcode'];
  const country = record.Country;

  locations.push({
    address: country,
    centroid: null,
    country_code: '',
    location: null,
    nuts: [],
    postal_code: postCode,
    region: '',
    town: '',
  });

  return locations;
};

/**
 * Preprocess `status`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Status`
 *
 * @memberof 2014tc16rfcb014CsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getStatus = record => (record.Status ? record.Status.trim() : '');

/**
 * Preprocess `third_parties`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Beneficiary/Lead Partner Name`
 *
 * @memberof 2014tc16rfcb014CsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<ThirdParty>}
 */

const getThirdParties = record => {
  const thirdParties = [];

  const name = record['Beneficiary/Lead Partner Name']
    ? record['Beneficiary/Lead Partner Name'].trim()
    : '';

  if (name) {
    thirdParties.push({
      address: '',
      country: '',
      email: '',
      name,
      phone: '',
      region: '',
      role: 'Lead Partner',
      type: '',
      website: '',
    });
  }

  return thirdParties;
};

/**
 * Format date.
 *
 * @memberof 2014tc16rfcb014CsvTransform
 * @param {Date} date Date in ready Date() object or DD.MM.YYYY as a fallback.
 * @returns {Date} The date formatted into an ISO 8601 date format
 *
 */
const formatDate = date => {
  if (!date) return null;

  try {
    return new Date(date).toISOString();
  } catch (error) {
    const parts = date.split('.');

    const [day, month, year] = parts;

    if (!day || !month || !year) return null;
    return new Date(Date.UTC(year, month - 1, day)).toISOString();
  }
};

/**
 * Preprocess `timeframe`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Operation Start Date`
 * - `Operation End Date`
 *
 * @memberof 2014tc16rfcb014CsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Timeframe}
 */

const getTimeframe = record => {
  const from = record['Operation Start Date'] || null;
  const to = record['Operation End Date'] || null;

  return {
    from: formatDate(from),
    from_precision: 'day',
    to: formatDate(to),
    to_precision: 'day',
  };
};

/**
 * Preprocess `title`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Operation/Project Name`
 *
 * @memberof 2014tc16rfcb014CsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getTitle = record =>
  record['Operation/Project Name']
    ? record['Operation/Project Name'].trim()
    : '';

/**
 * Map fields for 2014tc16rfpc001 producer, XLS file types
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014tc16rfpc001/xls/test/stubs/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014tc16rfpc001/xls/src/lib/transform.js|implementation details}
 *
 * @name 2014tc16rfpc001XlsTransform
 * @param {Object} record Piece of data to transform before going to harmonized storage.
 * @returns {Project} JSON matching the type fields.
 */
export default (record: Object): Project | null => {
  debugger;
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
    project_locations: getLocations(record),
    project_website: '',
    complete: false,
    related_links: [],
    reporting_organisation: 'Member states',
    results: {
      available: '',
      result: '',
    },
    status: getStatus(record),
    sub_programme_name: '',
    success_story: '',
    themes: [],
    third_parties: getThirdParties(record),
    timeframe: getTimeframe(record),
    title: getTitle(record),
    type: [],
  };
};
