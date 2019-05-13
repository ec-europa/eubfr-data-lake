// @flow

import crypto from 'crypto';
import countries from 'i18n-iso-countries';
import type { Project } from '@eubfr/types';
import getCountryCode from '@eubfr/lib/getCountryCode';
import sanitizeBudgetItem from '@eubfr/lib/budget/budgetFormatter';

/**
 * Preprocess `budget`.
 *
 * Input fields taken from the `record` are:
 * - `Total project costs £m`
 * - `ERDF/ESF investment £m`
 *
 * @memberof 2014uk16rfop001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Budget}
 */

const getBudget = record => ({
  total_cost: sanitizeBudgetItem({
    value: record['Total project costs £m'],
    currency: 'GBP',
    raw: record['Total project costs £m'],
  }),
  eu_contrib: sanitizeBudgetItem({
    value: record['ERDF/ESF investment £m'],
    currency: 'GBP',
    raw: record['ERDF/ESF investment £m'],
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
 * - `Type of fund`
 * - `Priority Axis`
 * - `Summary of project (max 100 words)`
 *
 * @memberof 2014uk16rfop001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getDescription = record => {
  let description = '';
  const fields = [
    'Type of fund',
    'Priority Axis',
    'Summary of project (max 100 words)',
  ];

  fields.forEach(descriptionField => {
    description += `${descriptionField}: ${record[descriptionField]} \n`;
  });

  return description;
};

/**
 * Preprocess `project_id`.
 *
 * Input fields taken from the `record` are:
 * - `Name of Project`
 *
 * @memberof 2014uk16rfop001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getProjectId = record => {
  return crypto
    .createHash('md5')
    .update(record['Name of Project'])
    .digest('hex');
};

/**
 * Gets country code from a country name.
 *
 * @memberof 2014uk16rfop001XlsTransform
 * @param {String} countryName The name of the country
 * @returns {String} The ISO 3166-1 country code
 */

const getCodeByCountry = countryName =>
  countries.getAlpha2Code(countryName, 'en');

/**
 * Preprocess `project_locations`.
 *
 * Input fields taken from the `record` are:
 * - `Location (postcode)`
 * - `Local Enterprise Partnership area`
 * - `Country`
 *
 * @memberof 2014uk16rfop001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<Location>}
 */

const getLocations = record => {
  const locations = [];
  const region = record['Local Enterprise Partnership area'] || '';
  const postCode = record['Location (postcode)'] || '';
  // We definitely expect England, UK or something similar, but if someone decides to include none of these, we respect it.
  const countryByLib = getCountryCode(getCodeByCountry(record.Country));
  const country = countryByLib || 'GB';

  locations.push({
    address: '',
    centroid: null,
    country_code: country,
    location: null,
    nuts: [],
    postal_code: postCode,
    region,
    town: '',
  });

  return locations;
};

/**
 * Preprocess `themes`.
 *
 * Input fields taken from the `record` are:
 * - `Type and focus of support (*Category of intervention)*`
 *
 * @memberof 2014uk16rfop001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<String>}
 */

const getThemes = record =>
  record['Type and focus of support (*Category of intervention)*']
    ? [
        record['Type and focus of support (*Category of intervention)*']
          .trim()
          .replace(/(\r\n|\n|\r)/gm, '')
          .replace(/ {1,}/g, ' '),
      ]
    : [];

/**
 * Preprocess `third_parties`.
 *
 * Input fields taken from the `record` are:
 * - `Recipient of funds`
 *
 * @memberof 2014uk16rfop001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<ThirdParty>}
 */

const getThirdParties = record =>
  record['Recipient of funds']
    ? [
        {
          address: '',
          country: 'GB',
          email: '',
          name: record['Recipient of funds']
            ? record['Recipient of funds'].trim()
            : '',
          phone: '',
          region: '',
          role: 'Beneficiary',
          type: '',
          website: '',
        },
      ]
    : [];

/**
 * Preprocess `timeframe`.
 *
 * Input fields taken from the `record` are:
 * - `Start date`
 * - `End date`
 *
 * @memberof 2014uk16rfop001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Timeframe}
 */

const getTimeframe = record => {
  const from = record['Start date'] || null;
  const to = record['End date'] || null;

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
 * - `Name of Project`
 *
 * @memberof 2014uk16rfop001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getTitle = record =>
  record['Name of Project'] ? record['Name of Project'].trim() : '';

/**
 * Map fields for 2014uk16rfop001 producer, XLS file types, ESIF funding type.
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014uk16rfop001/xls/test/stubs/ESIF/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014uk16rfop001/xls/src/lib/transform/ESIF/transform.js|implementation details}
 *
 * @name 2014uk16rfop001XlsTransform
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
