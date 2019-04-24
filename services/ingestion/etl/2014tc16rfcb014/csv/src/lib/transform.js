// @flow

import crypto from 'crypto';
import numeral from 'numeral';
import sanitizeBudgetItem from '@eubfr/lib/budget/budgetFormatter';
import type { Project } from '@eubfr/types';

/*
 * Transform message (2014tc16rfcb014 CSV)
 */

/**
 * Preprocess `budget`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Total eligible expenditure allocated to the full operation`
 * - `Total Union co-financing allocated to the full operation`
 *
 * @memberof 2014tc16rfcb014CsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Budget}
 */

const getBudget = record => {
  const { _value: euContrib } = numeral(
    record['Total Union co-financing allocated to the full operation']
  );
  const { _value: totalCost } = numeral(
    record['Total eligible expenditure allocated to the full operation']
  );

  return {
    eu_contrib: sanitizeBudgetItem({
      value: euContrib,
      currency: 'EUR',
      raw: record['Total Union co-financing allocated to the full operation'],
    }),
    funding_area: [],
    mmf_heading: '',
    other_contrib: sanitizeBudgetItem(),
    private_fund: sanitizeBudgetItem(),
    public_fund: sanitizeBudgetItem(),
    total_cost: sanitizeBudgetItem({
      value: totalCost,
      currency: 'EUR',
      raw: record['Total eligible expenditure allocated to the full operation'],
    }),
  };
};

/**
 * Preprocess `description`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Operation summary`
 *
 * @memberof 2014tc16rfcb014CsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getDescription = record =>
  record['Operation summary'] ? record['Operation summary'].trim() : '';

/**
 * Preprocess `ec_priorities`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Operation priority axis`
 *
 * @memberof 2014tc16rfcb014CsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<String>}
 */

const getPriorities = record =>
  record['Operation priority axis'].split(',').filter(a => a);

/**
 * Generates an ID for `project_id`.
 *
 * Input fields taken from the `record` are:
 * - `Operation name`
 *
 * @memberof 2014tc16rfcb014CsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getProjectId = record =>
  crypto
    .createHash('md5')
    .update(record['Operation name'])
    .digest('hex');

/**
 * Preprocess `project_locaions`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Location indicator`
 * - `Country`
 *
 * @memberof 2014tc16rfcb014CsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<Location>}
 */

const getLocations = record => {
  const locations = [];

  const postCodes = record['Location indicator']
    .split(';')
    .filter(a => a)
    .map(a => a.trim());
  const countries = record.Country.split(';')
    .filter(a => a)
    .map(a => a.trim());

  countries.forEach((country, key) => {
    locations.push({
      address: '',
      centroid: null,
      country_code: country,
      location: null,
      nuts: [],
      postal_code: postCodes[key],
      region: '',
      town: '',
    });
  });

  return locations;
};

/**
 * Preprocess `sub_programme_name`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Operation subprogramme`
 *
 * @memberof 2014tc16rfcb014CsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getSubProgramme = record =>
  record['Operation subprogramme']
    ? record['Operation subprogramme'].trim()
    : '';

/**
 * Preprocess `themes`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Interention categories`
 *
 * @memberof 2014tc16rfcb014CsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<String>}
 */

const getThemes = record =>
  record['Intervention categories']
    .split(',')
    .filter(t => t)
    .map(a => a.trim());

/**
 * Preprocess `third_parties`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Beneficiary name`
 * - `Beneficiary role`
 * - `Country`
 *
 * @memberof 2014tc16rfcb014CsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<ThirdParty>}
 */

const getThirdParties = record => {
  const actors = [];

  const names = record['Beneficiary name']
    .split(';')
    .filter(a => a)
    .map(a => a.trim());
  const roles = record['Beneficiary role']
    .split(';')
    .filter(a => a)
    .map(a => a.trim());
  const countries = record.Country.split(';')
    .filter(a => a)
    .map(a => a.trim());

  names.forEach((name, key) => {
    actors.push({
      address: '',
      country: countries[key],
      email: '',
      name,
      phone: '',
      region: '',
      role: roles[key],
      type: '',
      website: '',
    });
  });

  return actors;
};

/**
 * Format date.
 *
 * @memberof 2014tc16rfcb014CsvTransform
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
 * - `Operation start date`
 * - `Operatoin end date`
 *
 * @memberof 2014tc16rfcb014CsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Timeframe}
 */

const getTimeframe = record => {
  const from = record['Operation start date'] || null;
  const to = record['Operation end date'] || null;

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
 * - `Operation name`
 *
 * @memberof 2014tc16rfcb014CsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getTitle = record =>
  record['Operation name'] ? record['Operation name'].trim() : '';

/**
 * Map fields for 2014tc16rfcb014 producer, CSV file types
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014tc16rfcb014/csv/test/stubs/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014tc16rfcb014/csv/src/lib/transform.js|implementation details}
 * @name 2014tc16rfcb014CsvTransform
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
    sub_programme_name: getSubProgramme(record),
    success_story: '',
    themes: getThemes(record),
    third_parties: getThirdParties(record),
    timeframe: getTimeframe(record),
    title: getTitle(record),
    type: [],
  };
};
