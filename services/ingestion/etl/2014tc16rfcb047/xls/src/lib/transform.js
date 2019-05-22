// @flow

import crypto from 'crypto';
import countries from 'i18n-iso-countries';

import type { Project } from '@eubfr/types';
import getCountryCode from '@eubfr/lib/location/getCountryCode';
import sanitizeBudgetItem from '@eubfr/lib/budget/budgetFormatter';

/**
 * Preprocess `budget`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Total Project Cost (€)`
 * - `Total ERDF Allocated (€)`
 *
 * @memberof 2014tc16rfcb047XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Budget}
 */

const getBudget = record => ({
  total_cost: sanitizeBudgetItem({
    value: record['Total Project Cost (€)'],
    currency: 'EUR',
    raw: record['Total Project Cost (€)'],
  }),
  eu_contrib: sanitizeBudgetItem({
    value: record['Total ERDF Allocated (€)'],
    currency: 'EUR',
    raw: record['Total ERDF Allocated (€)'],
  }),
  private_fund: sanitizeBudgetItem(),
  public_fund: sanitizeBudgetItem(),
  other_contrib: sanitizeBudgetItem(),
  funding_area: [],
  mmf_heading: '',
});

/**
 * Preprocess `description`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Theme`
 * - `eMS Ref Num`
 * - `Operation/Project Summary`
 * - `Committed Outputs`
 * - `Total ERDF + Match (€)`
 * - `Total ERDF Allocated (€)`
 * - `Union Co-Financing Rate %`
 * - `Category of Intervention`
 *
 * @memberof 2014tc16rfcb047XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getDescription = record => {
  let description = '';

  const fields = [
    'Theme',
    'eMS Ref Num',
    'Operation/Project Summary',
    'Committed Outputs',
    'Total ERDF + Match (€)',
    'Total ERDF Allocated (€)',
    'Union Co-Financing Rate %',
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
 * Uses `Project Ref`, but if it's not present, the ID is generated based on `Operation/Project Name`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Project Ref`
 * - `Operation/Project Name`
 *
 * @memberof 2014tc16rfcb047XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getProjectId = record =>
  record['Project Ref']
    ? String(record['Project Ref']).trim()
    : crypto
        .createHash('md5')
        .update(record['Operation/Project Name'])
        .digest('hex');

/**
 * Gets country code from a country name.
 *
 * @memberof 2014tc16rfcb047XlsTransform
 * @param {String} countryName The name of the country
 * @returns {String} The ISO 3166-1 country code
 */

const getCodeByCountry = countryName =>
  countries.getAlpha2Code(countryName, 'en');

/**
 * Preprocess `project_locations`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Country`
 *
 * @memberof 2014tc16rfcb047XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<Location>}
 */

const getLocations = record => {
  const locations = [];
  // Get a list of countries separated by the following: `,`, `&`.
  const countryNames = record.Country.trim().split(/\s*(?:,|&)\s*/);

  countryNames.forEach(name => {
    const countryCode = getCountryCode(getCodeByCountry(name));

    if (countryCode) {
      locations.push({
        address: '',
        centroid: null,
        country_code: countryCode,
        location: null,
        nuts: [],
        postal_code: '',
        region: '',
        town: '',
      });
    }
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
 * @memberof 2014tc16rfcb047XlsTransform
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
 * @memberof 2014tc16rfcb047XlsTransform
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
 * @memberof 2014tc16rfcb047XlsTransform
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
 * @memberof 2014tc16rfcb047XlsTransform
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
 * @memberof 2014tc16rfcb047XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getTitle = record =>
  record['Operation/Project Name']
    ? record['Operation/Project Name'].trim()
    : '';

/**
 * Map fields for 2014tc16rfcb047 producer, XLS file types
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014tc16rfcb047/xls/test/stubs/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014tc16rfcb047/xls/src/lib/transform.js|implementation details}
 *
 * @name 2014tc16rfcb047XlsTransform
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
