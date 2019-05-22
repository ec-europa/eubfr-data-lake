// @flow

import crypto from 'crypto';
import countries from 'i18n-iso-countries';
import getCountryCode from '@eubfr/lib/location/getCountryCode';
import sanitizeBudgetItem from '@eubfr/lib/budget/budgetFormatter';
import type { Project } from '@eubfr/types';

/**
 * Preprocess `budget`.
 *
 * Input fields taken from the `record` are:
 *
 * - `total eligible expenditure`
 * - `ERDF`
 *
 * @memberof 2014tc16rfcb050XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Budget}
 */

const getBudget = record => {
  let total = 0;
  let euContrib = 0;

  record['total eligible expenditure']
    .split(';')
    .forEach(expense => (total += Number(expense))); // eslint-disable-line

  record.ERDF.split(';').forEach(expense => (euContrib += Number(expense))); // eslint-disable-line

  return {
    total_cost: sanitizeBudgetItem({
      value: total,
      currency: 'EUR',
      raw: record['total eligible expenditure'],
    }),
    eu_contrib: sanitizeBudgetItem({
      value: euContrib,
      currency: 'EUR',
      raw: record.ERDF,
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
 * - `acronym`
 * - `operation summary`
 * - `cofinancingrate`
 *
 * @memberof 2014tc16rfcb050XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getDescription = record => {
  let description = '';

  const fields = ['acronym', 'operation summary', 'cofinancingrate'];

  fields.forEach(field => {
    description += `${field}: ${record[field]}\n`;
  });

  return description;
};

/**
 * Preprocess `ec_priorities`.
 *
 * Input fields taken from the `record` are:
 *
 * - `investment priority`
 *
 * @memberof 2014tc16rfcb050XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<String>}
 */

const getPriorities = record =>
  record['investment priority']
    ? record['investment priority']
        .split(';')
        .filter(a => a)
        .map(a => a.trim())
        .map(a => a.replace(/(\r\n|\n|\r)/gm, ''))
        .map(a => a.replace(/ {1,}/g, ' '))
    : [];

/**
 * Preprocess `project_id`.
 *
 * Input fields taken from the `record` are:
 * - `operation name`
 *
 * @memberof 2014tc16rfcb050XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getProjectId = record =>
  crypto
    .createHash('md5')
    .update(record['operation name'])
    .digest('hex');

/**
 * Gets country code from a country name.
 *
 * @memberof 2014tc16rfcb050XlsTransform
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
 * - `nutslabel`
 * - `Country`
 *
 * @memberof 2014tc16rfcb050XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<Location>}
 */

const getLocations = record => {
  const locations = [];

  const countryList = record.Country.split(';')
    .filter(c => c)
    .map(c => c.trim())
    .map(c => getCountryCode(getCodeByCountry(c)));

  const regions = record.nutslabel
    .split(';')
    .filter(r => r)
    .map(r => r.trim());

  if (countryList.length) {
    countryList.forEach((code, key) => {
      // In project locations we care about unique locations in terms of country codes.
      const existing = locations.find(
        location => location.country_code === code
      );

      if (!existing) {
        locations.push({
          address: '',
          centroid: null,
          country_code: code,
          location: null,
          nuts: [],
          postal_code: '',
          region: regions[key],
          town: '',
        });
      }
    });
  }

  return locations;
};

/**
 * Preprocess `third_parties`.
 *
 * Input fields taken from the `record` are:
 *
 * - `beneficiary name`
 * - `role`
 * - `nutslabel`
 * - `Country`
 * - `beneficiary address`
 *
 * @memberof 2014tc16rfcb050XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<ThirdParty>}
 */

const getThirdParties = record => {
  const thirdParties = [];

  const actors = record['beneficiary name']
    ? record['beneficiary name']
        .split(';')
        .filter(a => a)
        .map(a => a.trim())
    : [];

  const addresses = record['beneficiary address']
    ? record['beneficiary address']
        .split(';')
        .filter(a => a)
        .map(a => a.trim())
        .map(a => a.replace(/(\r\n|\n|\r)/gm, ''))
        .map(a => a.replace(/ {1,}/g, ' '))
    : [];

  const regions = record.nutslabel
    .split(';')
    .filter(r => r)
    .map(r => r.trim());

  const roles = record.role
    ? record.role
        .split(';')
        .filter(r => r)
        .map(r => r.trim())
    : [];

  const countryList = record.Country.split(';')
    .filter(c => c)
    .map(c => c.trim());

  if (actors.length) {
    actors.forEach((name, key) => {
      thirdParties.push({
        address: addresses[key],
        country: countryList[key],
        email: '',
        name,
        phone: '',
        region: regions[key],
        role: roles[key],
        type: '',
        website: '',
      });
    });
  }

  return thirdParties;
};

/**
 * Format date.
 *
 * @memberof 2014tc16rfcb050XlsTransform
 * @param {Date} date Date in YYYY-MM-DD format
 * @returns {Date} The date formatted into an ISO 8601 date format
 *
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
 * Preprocess `timeframe`.
 *
 * Input fields taken from the `record` are:
 *
 * - `operation start date`
 * - `operation end date`
 *
 * @memberof 2014tc16rfcb050XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Timeframe}
 */

const getTimeframe = record => {
  const from = record['operation start date'] || null;
  const to = record['operation end date'] || null;

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
 * - `operation name`
 *
 * @memberof 2014tc16rfcb050XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getTitle = record =>
  record['operation name'] ? record['operation name'].trim() : '';

/**
 * Map fields for 2014tc16rfcb050 producer, XLS file types
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014tc16rfcb050/xls/test/stubs/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014tc16rfcb050/xls/src/lib/transform.js|implementation details}
 *
 * @name 2014tc16rfcb050XlsTransform
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
    ec_priorities: getPriorities(record),
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
