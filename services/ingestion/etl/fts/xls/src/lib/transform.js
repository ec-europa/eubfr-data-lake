// @flow

import sanitizeBudgetItem from '@eubfr/lib/budgetFormatter';
import countries from 'i18n-iso-countries';
import getCountryCode from '@eubfr/lib/getCountryCode';
import type { Project } from '@eubfr/types';

const getCodeByCountry = countryName => {
  // There are a few exceptions which should be normalized, regardless of the library
  const corrections = new Map([
    ['Tanzania', 'Tanzania, United Republic of'],
    ['Congo (Democratic Republic of)', 'Congo, the Democratic Republic of the'],
    ['Serbia (Republic of)', 'Serbia'],
    ['Occupied Territories - Palestine', 'Palestinian Territory, Occupied'],
    [
      'Macedonia (the former Yugoslav Republic of)',
      'Macedonia, the Former Yugoslav Republic of',
    ],
  ]);

  const countryNameCorrected = corrections.get(countryName) || countryName;

  return countries.getAlpha2Code(countryNameCorrected, 'en');
};

/**
 * Gets NUTS code level from a string
 *
 * @memberof FtsXlsTransform
 * @param {String} code The NUTS code
 * @returns {Number} The level of NUTS or null if one can't be extracted
 */
const getNutsCodeLevel = code => {
  if (code && code.length >= 2) {
    return code.length - 2;
  }
  return null;
};

/**
 * Preprocess budget
 *
 * @memberof FtsXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Budget}
 */
const getBudget = record => {
  /**
   * Still to process:
   * - Expense Type
   * - Subject of grant or contract
   */
  const budget = {
    eu_contrib: sanitizeBudgetItem({
      value: record.Amount,
      currency: 'EUR',
      raw: record.Amount,
    }),
    funding_area: [],
    mmf_heading: '',
    other_contrib: sanitizeBudgetItem(),
    private_fund: sanitizeBudgetItem(),
    public_fund: sanitizeBudgetItem(),
    total_cost: sanitizeBudgetItem({
      value: record['Total amount'],
      currency: 'EUR',
      raw: record['Total amount'],
    }),
  };

  return budget;
};

/**
 * Preprocess project_locations
 * Input fields taken from the `record` are:
 * - `Address`
 * - `City`
 * - `Postal code`
 * - `Country / Territory`
 * - `NUTS2`
 * - `Geographical Zone`
 *
 * @memberof FtsXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array} List of {Location} objects for `project_locations` field
 */
const getLocations = record => {
  // Get country code from country name
  const countryCode = getCodeByCountry(record['Country / Territory']);

  const location = {
    address: record.Address || '',
    centroid: null,
    country_code: getCountryCode(countryCode),
    location: null,
    nuts: [],
    postal_code: record['Postal code'] || '',
    region: '',
    town: record.City || '',
  };

  // It's possible that some records have this.
  // If present, use it.
  if (record.NUTS2) {
    location.nuts.push({
      code: record.NUTS2,
      name: '',
      level: getNutsCodeLevel(record.NUTS2),
      year: null,
    });
  }

  return [location];
};

/**
 * Map fields for FTS producer, XLS file types
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/fts/xls/test/stubs/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/fts/xls/src/lib/transform.js|implementation details}
 * @name FtsXlsTransform
 * @param {Object} record Piece of data to transform before going to harmonized storage.
 * @returns {Project} JSON matching the type fields.
 */
export default (record: Object): Project | null => {
  if (!record) return null;

  // Map the fields
  return {
    action: '',
    budget: getBudget(record),
    call_year: record.Year || '',
    description: record['Budget line name and number'] || '',
    ec_priorities: [],
    media: [],
    programme_name: record['Action Type'] || '',
    project_id: record['Reference of the Legal Commitment (LC)'],
    project_locations: getLocations(record),
    project_website: '',
    complete: true,
    related_links: [],
    reporting_organisation: 'BUDG',
    results: {
      available: '',
      result: '',
    },
    status: '',
    sub_programme_name: '',
    success_story: '',
    themes: [],
    third_parties: [],
    timeframe: {
      from: '',
      from_precision: 'day',
      to: '',
      to_precision: 'day',
    },
    title: '',
    type: [],
  };
};
