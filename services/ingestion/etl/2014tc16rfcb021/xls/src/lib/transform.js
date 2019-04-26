// @flow

import countries from 'i18n-iso-countries';
import crypto from 'crypto';

import type { Project } from '@eubfr/types';

import getCountryCode from '@eubfr/lib/getCountryCode';
import sanitizeBudgetItem from '@eubfr/lib/budget/budgetFormatter';

/**
 * Preprocess `budget`.
 *
 * Input fields taken from the `record` are:
 * - `Approved budget`
 * - `Community Funding ERDF(euro)`
 *
 * @memberof 2014tc16rfcb021XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Budget}
 */

const getBudget = record => ({
  total_cost: sanitizeBudgetItem({
    value: record['Approved budget'],
    currency: 'EUR',
    raw: record['Approved budget'],
  }),
  eu_contrib: sanitizeBudgetItem({
    value: record['Community Funding ERDF(euro)'],
    currency: 'EUR',
    raw: record['Community Funding ERDF(euro)'],
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
 * - `Ranking`
 * - `Project code`
 * - `Objectives`
 * - `Duration`
 * - `Category of intervention`
 * - `Percent (ERDF)`
 * - `National co-financing(euro)`
 * - `Percent (National co-financing)`
 * - `Own Contribution (euro)`
 * - `Percent (Own Contributions)`
 *
 * @memberof 2014tc16rfcb021XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getDescription = record => {
  const fields = [
    'Ranking',
    'Project code',
    'Objectives',
    'Duration',
    'Category of intervention',
    'Percent (ERDF)',
    'National co-financing(euro)',
    'Percent (National co-financing)',
    'Own Contribution (euro)',
    'Percent (Own Contributions)',
  ];
  let description = '';

  fields.forEach(descriptionField => {
    description += `${descriptionField}: ${record[descriptionField]} \n`;
  });

  return description;
};

/**
 * Preprocess `project_id`.
 *
 * Input fields taken from the `record` are:
 * - `e-MS code`
 *
 * @memberof 2014tc16rfcb021XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getProjectId = record =>
  record['e-MS code']
    ? crypto
        .createHash('md5')
        .update(String(record['e-MS code']))
        .digest('hex')
    : '';

/**
 * Gets country code from a country name.
 *
 * @memberof 2014tc16rfcb021XlsTransform
 * @param {String} countryName The name of the country
 * @returns {String} The ISO 3166-1 country code
 */

const getCodeByCountry = countryName =>
  countries.getAlpha2Code(countryName, 'en');

/**
 * Preprocess `project_locations`.
 *
 * Input fields taken from the `record` are:
 * - `Country`
 * - `County/District`
 *
 * @memberof 2014tc16rfcb021XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<Location>}
 */

const getLocations = record => {
  const locations = [];

  const region = record['County/District']
    ? record['County/District'].trim()
    : '';

  const country = record.Country ? record.Country.trim() : '';
  const countryCode = getCountryCode(getCodeByCountry(country));

  if (countryCode) {
    locations.push({
      address: '',
      centroid: null,
      country_code: countryCode,
      location: null,
      nuts: [],
      postal_code: '',
      region,
      town: '',
    });
  }

  return locations;
};

/**
 * Preprocess `status`.
 *
 * Input fields taken from the `record` are:
 * - `Status`
 *
 * @memberof 2014tc16rfcb021XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getStatus = record => (record.Status ? record.Status.trim() : '');

/**
 * Preprocess `third_parties`.
 *
 * Input fields taken from the `record` are:
 * - `Lead beneficiary/ beneficiary/ies`
 * - `Country`
 * - `County/District`
 *
 * @memberof 2014tc16rfcb021XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<ThirdParty>}
 */

const getThirdParties = record => {
  const thirdParties = [];
  const name = record['Lead beneficiary/ beneficiary/ies']
    ? record['Lead beneficiary/ beneficiary/ies'].trim()
    : '';
  const country = record.Country;
  const region = record['County/District']
    ? record['County/District'].trim()
    : '';

  if (name || country) {
    thirdParties.push({
      address: '',
      country,
      email: '',
      name,
      phone: '',
      region,
      role: 'coordinator',
      type: '',
      website: '',
    });
  }

  return thirdParties;
};

/**
 * Format date.
 *
 * @memberof 2014tc16rfcb021XlsTransform
 * @param {Date} date Date in DD.MM.YYYY format
 * @returns {Date} The date formatted into an ISO 8601 date format
 *
 * @example
 * input => "01.01.2009"
 * output => "2009-01-01T00:00:00.000Z"
 */
const formatDate = date => {
  if (!date || typeof date !== 'string') return null;
  const d = date.split('.');
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
 * - `Start date`
 * - `End date`
 *
 * @memberof 2014tc16rfcb021XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Timeframe}
 */

const getTimeframe = record => {
  const from = record['Start date'] ? formatDate(record['Start date']) : null;
  const to = record['End date'] ? formatDate(record['End date']) : null;

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
 * - `Project title`
 *
 * @memberof 2014tc16rfcb021XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getTitle = record =>
  record['Project title'] ? record['Project title'].trim() : '';

/**
 * Map fields for 2014tc16rfcb021 producer, XLS file types
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014tc16rfcb021/xls/test/stubs/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014tc16rfcb021/xls/src/lib/transform.js|implementation details}
 * @name 2014tc16rfcb021XlsTransform
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
