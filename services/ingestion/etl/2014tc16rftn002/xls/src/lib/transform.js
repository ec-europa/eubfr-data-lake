// @flow

import countries from 'i18n-iso-countries';
import getCountryCode from '@eubfr/lib/getCountryCode';
import type { Project } from '@eubfr/types';
import sanitizeBudgetItem from '@eubfr/lib/budget/budgetFormatter';

/**
 * Preprocess `budget`.
 *
 * Input fields taken from the `record` are:
 * - `Total of eligible expenditure`
 * - `ERDF expenditure allocated`
 *
 * @memberof 2014tc16rftn002XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Budget}
 */

const getBudget = record => ({
  total_cost: sanitizeBudgetItem({
    value: Math.floor(record['Total of eligible expenditure']),
    currency: 'EUR',
    raw: record['Total of eligible expenditure'],
  }),
  eu_contrib: sanitizeBudgetItem({
    value: Math.floor(record['ERDF expenditure allocated']),
    currency: 'EUR',
    raw: record['ERDF expenditure allocated'],
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
 * - `Acronym`
 * - `Summary`
 *
 * @memberof 2014tc16rftn002XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getDescription = record => {
  let description = '';
  const fields = ['Acronym', 'Summary'];

  fields.forEach(descriptionField => {
    description += `${descriptionField}: ${record[descriptionField]} \n`;
  });

  return description;
};

/**
 * Preprocess `project_id`.
 *
 * Input fields taken from the `record` are:
 * - `Operation code nr.`
 *
 * @memberof 2014tc16rftn002XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getProjectId = record => record['Operation code nr.'];

/**
 * Gets country code from a country name.
 *
 * @memberof 2014tc16rftn002XlsTransform
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
 *
 * @memberof 2014tc16rftn002XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<Location>}
 */

const getLocations = record => {
  const locations = [];
  const code = getCountryCode(getCodeByCountry(record.Country));

  if (record.Country) {
    locations.push({
      address: '',
      centroid: null,
      country_code: code,
      location: null,
      nuts: [],
      postal_code: '',
      region: '',
      town: '',
    });
  }

  return locations;
};

/**
 * Preprocess `themes`.
 *
 * Input fields taken from the `record` are:
 * - `Programme specific objective`
 *
 * @memberof 2014tc16rftn002XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<String>}
 */

const getThemes = record => {
  const themes = [];

  if (record['Programme specific objective']) {
    themes.push(record['Programme specific objective'].trim());
  }

  return themes;
};

/**
 * Preprocess `third_parties`.
 *
 * Input fields taken from the `record` are:
 * - `Lead partner name`
 * - `Lead partner location region`
 * - `Country`
 *
 * @memberof 2014tc16rftn002XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<ThirdParty>}
 */

const getThirdParties = record => {
  const thirdParties = [];

  const name = record['Lead partner name']
    ? record['Lead partner name'].trim()
    : '';
  const region = record['Lead partner location region']
    ? record['Lead partner location region'].trim()
    : '';
  const country = record.Country;

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
 * Preprocess `timeframe`.
 *
 * Input fields taken from the `record` are:
 * - `Start date`
 * - `End date`
 *
 * @memberof 2014tc16rftn002XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Timeframe}
 */

const getTimeframe = record => {
  const from = record['Start date']
    ? new Date(record['Start date']).toISOString()
    : null;
  const to = record['End date']
    ? new Date(record['End date']).toISOString()
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
 * - `Operation name`
 *
 * @memberof 2014tc16rftn002XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getTitle = record =>
  record['Operation name'] ? record['Operation name'].trim() : '';

/**
 * Map fields for 2014tc16rftn002 producer, XLS file types
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014tc16rftn002/xls/test/stubs/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014tc16rftn002/xls/src/lib/transform.js|implementation details}
 * @name 2014tc16rftn002XlsTransform
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
