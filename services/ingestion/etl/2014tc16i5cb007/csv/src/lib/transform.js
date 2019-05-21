// @flow

import countries from 'i18n-iso-countries';
import getCountryCode from '@eubfr/lib/getCountryCode';
import numeral from 'numeral';
import sanitizeBudgetItem from '@eubfr/lib/budget/budgetFormatter';
import type { Project } from '@eubfr/types';

/*
 * Transform message (2014tc16i5cb007 CSV)
 */

/**
 * Preprocess `budget`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Project final contract amount`
 * - `Project EU co-financing rate`
 *
 * @memberof 2014tc16i5cb007CsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Budget}
 */

const getBudget = record => {
  const { _value: total } = numeral(record['Project final contract amount']);

  const { _value: percentage } = numeral(
    record['Project EU co-financing rate']
  );

  const euContrib = total * percentage;

  return {
    eu_contrib: sanitizeBudgetItem({
      value: euContrib,
      currency: 'EUR',
      raw: record['Project EU co-financing rate'],
    }),
    funding_area: [],
    mmf_heading: '',
    other_contrib: sanitizeBudgetItem(),
    private_fund: sanitizeBudgetItem(),
    public_fund: sanitizeBudgetItem(),
    total_cost: sanitizeBudgetItem({
      value: total,
      currency: 'EUR',
      raw: record['Project final contract amount'],
    }),
  };
};

/**
 * Preprocess `description`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Project call`
 * - `Project intervention field`
 * - `Last modified`
 *
 * @memberof 2014tc16i5cb007CsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getDescription = record => {
  const fields = [
    'Project call',
    'Project intervention field',
    'Last modified',
  ];
  let description = '';

  fields.forEach(field => {
    if (record[field]) {
      description += `${field}: ${record[field]} \n`;
    }
  });

  return description;
};

/**
 * Generates an ID for `project_id`.
 *
 * Input fields taken from the `record` are:
 * - `Project code`
 *
 * @memberof 2014tc16i5cb007CsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getProjectId = record => record['Project code'];

/**
 * Gets country code from a country name.
 *
 * @memberof 2014tc16i5cb007CsvTransform
 * @param {String} countryName The name of the country
 * @returns {String} The ISO 3166-1 country code
 */

const getCodeByCountry = countryName =>
  countries.getAlpha2Code(countryName, 'en');

/**
 * Preprocess `project_locaions`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Region`
 * - `Country`
 *
 * @memberof 2014tc16i5cb007CsvTransform
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
      postal_code: '',
      region: record.Region,
      town: '',
    });
  }

  return locations;
};

/**
 * Preprocess `third_parties`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Leading partner`
 * - `Region`
 * - `Country`
 *
 * @memberof 2014tc16i5cb007CsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<ThirdParty>}
 */

const getThirdParties = record => {
  const actors = [];

  actors.push({
    address: '',
    country: record.Country,
    email: '',
    name: record['Leading partner'],
    phone: '',
    region: record.Region,
    role: 'coordinator',
    type: '',
    website: '',
  });

  return actors;
};

/**
 * Format date.
 *
 * @memberof 2014tc16i5cb007CsvTransform
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
 *
 * - `Project start date`
 * - `Project end date`
 *
 * @memberof 2014tc16i5cb007CsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Timeframe}
 */

const getTimeframe = record => {
  const from = record['Project start date'] || null;
  const to = record['Project end date'] || null;

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
 * - `Project title`
 *
 * @memberof 2014tc16i5cb007CsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getTitle = record =>
  record['Project title'] ? record['Project title'].trim() : '';

/**
 * Map fields for 2014tc16i5cb007 producer, CSV file types
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014tc16i5cb007/csv/test/stubs/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014tc16i5cb007/csv/src/lib/transform.js|implementation details}
 * @name 2014tc16i5cb007CsvTransform
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
    type: [],
  };
};
