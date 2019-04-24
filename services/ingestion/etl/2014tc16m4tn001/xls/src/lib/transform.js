// @flow

import crypto from 'crypto';
import countries from 'i18n-iso-countries';
import getCountryCode from '@eubfr/lib/getCountryCode';
import type { Project } from '@eubfr/types';
import sanitizeBudgetItem from '@eubfr/lib/budget/budgetFormatter';

/**
 * Preprocess `budget`.
 *
 * Input fields taken from the `record` are:
 * - `Amount of the project (ERDF +IPA + national counterpart)`
 * - `Co financing rate`
 *
 * @memberof 2014tc16m4tn001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Budget}
 */

const getBudget = record => {
  const euContrib =
    record['Amount of the project (ERDF +IPA + national counterpart)'] *
    record['Co financing rate'];

  return {
    total_cost: sanitizeBudgetItem({
      value: record['Amount of the project (ERDF +IPA + national counterpart)'],
      currency: 'EUR',
      raw: record['Amount of the project (ERDF +IPA + national counterpart)'],
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
 * - `Axis`
 * - `Objective`
 * - `Acronym`
 * - `Operation summary`
 * - `Call for proposals`
 * - `ERDF`
 * - `IPA Funds`
 *
 * @memberof 2014tc16m4tn001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getDescription = record => {
  const fields = [
    'Axis',
    'Objective',
    'Acronym',
    'Operation summary',
    'Call for proposals',
    'ERDF',
    'IPA Funds',
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
 * - `Project label`
 *
 * @memberof 2014tc16m4tn001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getProjectId = record =>
  record['Project label']
    ? crypto
        .createHash('md5')
        .update(String(record['Project label']))
        .digest('hex')
    : '';

/**
 * Gets country code from a country name.
 *
 * @memberof 2014tc16m4tn001XlsTransform
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
 * - `Postcode`
 *
 * @memberof 2014tc16m4tn001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<Location>}
 */

const getLocations = record => {
  const locations = [];
  const code = getCountryCode(getCodeByCountry(record.Country));

  if (code) {
    locations.push({
      address: '',
      centroid: null,
      country_code: code,
      location: null,
      nuts: [],
      postal_code: record.Postcode,
      region: '',
      town: '',
    });
  }

  return locations;
};

/**
 * Preprocess `third_parties`.
 *
 * Input fields taken from the `record` are:
 * - `Lead Partner`
 * - `Country`
 *
 * @memberof 2014tc16m4tn001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<ThirdParty>}
 */

const getThirdParties = record => {
  const thirdParties = [];
  const name = record['Lead Partner'] ? record['Lead Partner'].trim() : '';
  const country = record.Country;

  if (name || country) {
    thirdParties.push({
      address: '',
      country,
      email: '',
      name,
      phone: '',
      region: '',
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
 * @memberof 2014tc16m4tn001XlsTransform
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
 * - `Project label`
 *
 * @memberof 2014tc16m4tn001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getTitle = record =>
  record['Project label'] ? record['Project label'].trim() : '';

/**
 * Preprocess `type`.
 *
 * Input fields taken from the `record` are:
 * - `Type of project`
 *
 * @memberof 2014tc16m4tn001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getTypes = record =>
  record['Type of project'] ? [record['Type of project'].trim()] : [];

/**
 * Map fields for 2014tc16m4tn001 producer, XLS file types
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014tc16m4tn001/xls/test/stubs/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014tc16m4tn001/xls/src/lib/transform.js|implementation details}
 * @name 2014tc16m4tn001XlsTransform
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
    themes: [],
    third_parties: getThirdParties(record),
    timeframe: getTimeframe(record),
    title: getTitle(record),
    type: getTypes(record),
  };
};
