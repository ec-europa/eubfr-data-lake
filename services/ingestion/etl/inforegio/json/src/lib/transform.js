// @flow

import numeral from 'numeral';
import sanitizeBudgetItem from '@eubfr/lib/budget/budgetFormatter';
import extractBudgetData from '@eubfr/lib/budget/extractBudgetData';
import getCountryCode from '@eubfr/lib/getCountryCode';
import type { Project } from '@eubfr/types';

/**
 * Preprocess `funding_area`
 *
 * Converts a single string to an array of multiple values
 *
 * @memberof InforegioJsonTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array} List of string values for `funding_area` field
 *
 * @example
 * input => "Research & innovation; Investment for growth; Transport"
 * output => ["Research & innovation", "Investment for growth", "Transport"]
 */
const getFundingArea = record =>
  record.Funds ? record.Funds.split(';').filter(fund => fund) : [];

/**
 * Format date
 *
 * @memberof InforegioJsonTransform
 * @param {Date} date Date in "10/9/2014" (DD/MM/YYYY) format
 * @returns {Date} The date formatted into an ISO 8601 date format
 *
 * @example
 * input => "01/01/2009"
 * output => "2009-01-01T00:00:00.000Z"
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
 * Preprocess address
 *
 * Input fields taken from the `record` are:
 *
 * - `Beneficiary_address`
 * - `Beneficiary_Post_Code`
 * - `Beneficiary_City`
 *
 * @memberof InforegioJsonTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array} A list of {Partner} objects
 */
const getAddress = record => {
  let address = '';
  if (record.Beneficiary_address) {
    address += record.Beneficiary_address;
  }
  if (record.Beneficiary_Post_Code) {
    if (address !== '') address += ', ';
    address += record.Beneficiary_Post_Code;
  }
  if (record.Beneficiary_City) {
    if (address !== '') address += ', ';
    address += record.Beneficiary_City;
  }
  return address;
};

/**
 * Preprocess beneficiaries
 *
 * Input fields taken from the `record` are:
 *
 * - `Beneficiary`
 * - `Beneficiary_Country`
 *
 * @memberof InforegioJsonTransform
 * @param {Object} record The row received from harmonized storage
 * @returns {Array} A list of a single {Beneficiary} object
 */
const getBeneficiaries = record => [
  {
    name: record.Beneficiary,
    type: '',
    address: getAddress(record),
    region: '',
    role: 'beneficiary',
    country: record.Beneficiary_Country,
    website: '',
    phone: '',
    email: '',
  },
];

/**
 * Gets NUTS code level from a string
 *
 * @memberof inforegioXmlTransform
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
 * Preprocess locations
 *
 * Input fields taken from the `record` are:
 *
 * - `Project_country`
 * - `Project_region`
 * - `Project_NUTS2_code`
 *
 * @memberof InforegioJsonTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array} List of {Location} objects for `project_locations` field
 */
const getLocations = record => {
  const locationArray = [];
  const countryArray = record.Project_country
    ? record.Project_country.split('; ').filter(country => country)
    : null;
  const previousCountries = [];
  if (countryArray !== null && countryArray.length > 1) {
    for (let i = 0; i < countryArray.length; i += 1) {
      if (previousCountries.indexOf(countryArray[i] === -1)) {
        locationArray.push({
          address: '',
          centroid: null,
          country_code: getCountryCode(countryArray[i]),
          location: null,
          nuts: [],
          postal_code: '',
          region: '',
          town: '',
        });
        previousCountries.push(countryArray[i]);
      }
    }
  } else {
    locationArray.push({
      country_code: getCountryCode(record.Project_country),
      region: record.Project_region,
      nuts: [
        {
          code: record.Project_NUTS2_code,
          name: '',
          level: getNutsCodeLevel(record.Project_NUTS2_code),
          year: null,
        },
      ],
      address: '',
      postal_code: '',
      town: '',
      location: null,
      centroid: null,
    });
  }

  return locationArray;
};

/**
 * Preprocess `project_website` field
 *
 * Input fields taken from the `record` are:
 *
 * - `URL`
 *
 * @memberof InforegioJsonTransform
 * @param {Object} record The row received from parsed file
 * @returns {string}
 */
const getProjectWebsite = record => {
  if (record.URL) {
    if (typeof record.URL === 'object') {
      return record.URL[0];
    }

    if (typeof record.URL === 'string') {
      return record.URL;
    }
  }

  return '';
};

/**
 * Preprocess value field of {BudgetItem}.
 *
 * @memberof InforegioJsonTransform
 * @param {string} budget String containing numeric data
 * @returns {BudgetItem}
 */
const formatBudget = budget => {
  if (!budget || typeof budget !== 'string') return sanitizeBudgetItem();

  const { value, currency } = extractBudgetData(budget);
  const { _value: valueFromatted } = numeral(value);

  return sanitizeBudgetItem({
    value: Math.floor(valueFromatted),
    currency,
    raw: budget,
  });
};

/**
 * Map fields for INFOREGIO producer, JSON file types
 *
 * Mapping document: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/inforegio/mapping.md|markdown version}
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/inforegio/json/src/lib/transform.js|implementation details}
 * @name InforegioJsonTransform
 * @param {Object} record Piece of data to transform before going to harmonized storage.
 * @returns {Project} JSON matching the type fields.
 */
export default (record: Object): Project | null => {
  if (!record) return null;

  // Preprocess budget
  const budgetObject = {
    total_cost: formatBudget(record.Total_project_budget),
    eu_contrib: formatBudget(record.EU_Budget_contribution),
    private_fund: formatBudget(),
    public_fund: formatBudget(),
    other_contrib: formatBudget(),
    funding_area: getFundingArea(record),
    mmf_heading: '',
  };

  // Preprocess third parties
  const thirdPartiesArray = getBeneficiaries(record);

  // Preprocess project locations
  const locationArray = getLocations(record);

  // Preprocess themes
  const themeArray = record.Thèmes ? record.Thèmes.split('; ') : [];

  // Preprocess type
  const typeArray = [record.Project_type];

  // Map the fields
  return {
    action: '',
    budget: budgetObject,
    call_year: '',
    description: record.quote,
    ec_priorities: [],
    media: [],
    period: record.Period,
    programme_name: '',
    project_id: record.PROJECTID.toString(),
    project_locations: locationArray,
    project_website: getProjectWebsite(record),
    complete: false,
    related_links: [],
    reporting_organisation: 'REGIO',
    results: {
      available: '',
      result: '',
    },
    status: '',
    sub_programme_name: '',
    success_story: '',
    themes: themeArray,
    third_parties: thirdPartiesArray,
    timeframe: {
      from: formatDate(record.Project_Timeframe_start_date),
      from_precision: 'day',
      to: formatDate(record.Project_Timeframe_end_date),
      to_precision: 'day',
    },
    title: record.Project_name,
    type: typeArray,
  };
};
