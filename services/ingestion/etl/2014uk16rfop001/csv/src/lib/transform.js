// @flow

import crypto from 'crypto';
import numeral from 'numeral';
import sanitizeBudgetItem from '@eubfr/lib/budget/budgetFormatter';
import type { Project } from '@eubfr/types';

/*
 * Transform message (2014uk16rfop001 CSV)
 */

/**
 * Preprocess `budget`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Total project costs �m (eligible project costs only)`
 * - `% of project funded by EU (Co-financing rate%)`
 *
 * @memberof 2014uk16rfop001CsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Budget}
 */

const getBudget = record => {
  const rates = record['% of project funded by EU (Co-financing rate%)'].split(
    ';'
  );
  const costs = record[
    'Total project costs �m (eligible project costs only)'
  ].split(';');

  let rate = 0;

  rates.forEach(percentage => {
    const { _value: percent } = numeral(percentage);
    rate += percent;
  });

  let cost = 0;

  costs.forEach(costItem => {
    const { _value: costValue } = numeral(costItem);
    cost += costValue;
  });

  return {
    eu_contrib: sanitizeBudgetItem({
      value: cost * rate,
      currency: 'GBP',
      raw: record['% of project funded by EU (Co-financing rate%)'],
    }),
    funding_area: [],
    mmf_heading: '',
    other_contrib: sanitizeBudgetItem(),
    private_fund: sanitizeBudgetItem(),
    public_fund: sanitizeBudgetItem(),
    total_cost: sanitizeBudgetItem({
      value: cost,
      currency: 'GBP',
      raw: record['Total project costs �m (eligible project costs only)'],
    }),
  };
};

/**
 * Preprocess `description`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Summary of project(max 100 words)`
 * - `Local enterprise partnership area`
 *
 * @memberof 2014uk16rfop001CsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getDescription = record => {
  const fields = [
    'Summary of project(max 100 words)',
    'Local enterprise partnership area',
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
 * - `Name of project`
 *
 * @memberof 2014uk16rfop001CsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getProjectId = record =>
  crypto
    .createHash('md5')
    .update(record['Name of project'])
    .digest('hex');

/**
 * Preprocess `project_locations`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Location (postcode)`
 *
 * @memberof 2014uk16rfop001CsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<Location>}
 */

const getLocations = record => {
  const locations = [];

  const regions = record['Location (postcode)']
    .split(';')
    .filter(a => a)
    .map(a => a.trim());

  regions.forEach(region => {
    locations.push({
      address: '',
      centroid: null,
      country_code: 'GB',
      location: null,
      nuts: [],
      postal_code: '',
      region,
      town: '',
    });
  });

  return locations;
};

/**
 * Preprocess `themes`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Type and focus support (category of intervention)`
 *
 * @memberof 2014uk16rfop001CsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<String>}
 */

const getThemes = record => [
  record['Type and focus support (category of intervention)'].trim(),
];

/**
 * Preprocess `third_parties`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Recipient of funds(ERDF/ESF beneficiary)`
 *
 * @memberof 2014uk16rfop001CsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<ThirdParty>}
 */

const getThirdParties = record =>
  record['Recipient of funds(ERDF/ESF beneficiary)']
    ? [
        {
          address: '',
          country: 'England',
          email: '',
          name: record['Recipient of funds(ERDF/ESF beneficiary)'].trim(),
          phone: '',
          region: '',
          role: 'Beneficiary',
          type: '',
          website: '',
        },
      ]
    : [];

/**
 * Format date.
 *
 * @memberof 2014uk16rfop001CsvTransform
 * @param {Date} date
 * @returns {Date} The date formatted into an ISO 8601 date format
 *
 */
const formatDate = date => {
  if (!date || typeof date !== 'string') return null;

  // Since input format cannot be parsed by native Date() constructor directly:
  const d = date.split('-');
  if (d.length !== 2) return null;
  // We extract information about month and year manually.
  const [m, y] = d;
  if (!m || !y) return null;
  // Get month natively from original date string for the UTC method.
  const month = new Date(d).getMonth();

  try {
    return new Date(Date.UTC(Number(`20${y}`), month)).toISOString();
  } catch (e) {
    return null;
  }
};

/**
 * Preprocess `timeframe`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Start date`
 * - `End date`
 *
 * @memberof 2014uk16rfop001CsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Timeframe}
 */

const getTimeframe = record => {
  const from = record['Start date'] || null;
  const to = record['End date'] || null;

  return {
    from: formatDate(from),
    from_precision: 'month',
    to: formatDate(to),
    to_precision: 'month',
  };
};

/**
 * Preprocess `title`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Name of project`
 *
 * @memberof 2014uk16rfop001CsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getTitle = record =>
  record['Name of project'] ? record['Name of project'].trim() : '';

/**
 * Preprocess `type`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Type of fund`
 *
 * @memberof 2014uk16rfop001CsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<String>}
 */

const getType = record =>
  record['Type of fund'] ? [record['Type of fund'].trim()] : [];

/**
 * Map fields for 2014uk16rfop001 producer, CSV file types
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014uk16rfop001/csv/test/stubs/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014uk16rfop001/csv/src/lib/transform.js|implementation details}
 * @name 2014uk16rfop001CsvTransform
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
    type: getType(record),
  };
};
