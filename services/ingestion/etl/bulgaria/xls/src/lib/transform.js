// @flow

import crypto from 'crypto';
import sanitizeBudgetItem from '@eubfr/lib/budget/budgetFormatter';
import numeral from 'numeral';
import type { Project } from '@eubfr/types';

/**
 * Preprocess `budget` field.
 *
 * Input fields taken from the `record` are:
 * - `Total Eligible Costs Granted for the Operation`
 * - `% of EC co-financing`
 *
 * @memberof BulgariaXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Budget}
 */
const getBudget = record => {
  const { _value: total } = numeral(
    record['Total Eligible Costs Granted for the Operation']
  );
  const { _value: percentage } = numeral(record['% of EC co-financing']);
  const euContrib = (total * percentage) / 100;

  const budget = {
    total_cost: sanitizeBudgetItem({
      value: total,
      currency: 'BGN',
      raw: record['Total Eligible Costs Granted for the Operation'],
    }),
    eu_contrib: sanitizeBudgetItem({
      value: euContrib,
      currency: 'BGN',
      raw: euContrib,
    }),
    private_fund: sanitizeBudgetItem(),
    public_fund: sanitizeBudgetItem(),
    other_contrib: sanitizeBudgetItem(),
    funding_area: [],
    mmf_heading: '',
  };

  return budget;
};

/**
 * Preprocess `description` field.
 *
 * Input fields taken from the `record` are:
 * - `Summary of the Operation`
 *
 * @memberof BulgariaXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getProjectDescription = record =>
  record['Summary of the Operation'] || '';

/**
 * Preprocess `third_parties` field.
 *
 * Input fields taken from the `record` are:
 * - `Beneficiary Name`
 *
 * @memberof BulgariaXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<ThirdParty>}
 */

const getThirdParties = record => {
  const beneficieries = [];

  if (record['Beneficiary Name']) {
    const beneficiary = {
      address: '',
      country: '',
      email: '',
      name: record['Beneficiary Name'],
      phone: '',
      region: '',
      role: '',
      type: 'beneficiary',
      website: '',
    };

    beneficieries.push(beneficiary);
  }

  return beneficieries;
};

/**
 * Generates `project_id`.
 *
 * Input fields taken from the `record` are:
 * - `Operation Name`
 *
 * @memberof BulgariaXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getProjectId = record =>
  crypto
    .createHash('md5')
    .update(record['Operation Name'])
    .digest('hex');

/**
 * Preprocess `project_locations`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Location`
 *
 * @memberof BulgariaXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<Location>}
 */
const getLocations = record => {
  const locations = [];

  if (record.Location) {
    const locs = record.Location.split(';').filter(l => l);

    locs.forEach(location => {
      // Sometimes it's the country, sometimes a town, respect it only when it's a the town, as we know the country.
      if (location !== 'Bulgaria') {
        locations.push({
          address: '',
          centroid: null,
          country_code: 'BG',
          location: null,
          nuts: [],
          postal_code: '',
          region: '',
          town: location.replace(/(\r\n|\n|\r)/gm, ''),
        });
      }
    });
  }

  // If no other information, fill in the basics so that the project can be visualized on maps.
  if (locations.length === 0) {
    locations.push({
      address: '',
      centroid: null,
      country_code: 'BG',
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
 * Format date.
 *
 * @memberof BulgariaXlsTransform
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
 * Preprocess `timeframe` field.
 *
 * Input fields taken from the `record` are:
 * - `Operation Start Date`
 * - `Date of Completion of the Operation`
 *
 * @memberof BulgariaXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Timeframe}
 */
const getTimeframe = record => {
  const timeframe = {
    from: record['Operation Start Date']
      ? formatDate(record['Operation Start Date'])
      : '',
    from_precision: 'day',
    to: record['Date of Completion of the Operation']
      ? formatDate(record['Date of Completion of the Operation'])
      : '',
    to_precision: 'day',
  };

  return timeframe;
};

/**
 * Preprocess `title` field.
 *
 * Input fields taken from the `record` are:
 * - `Operation Name`
 *
 * @memberof BulgariaXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getProjectTitle = record =>
  record['Operation Name']
    ? record['Operation Name'].replace(/['"]+/g, '')
    : '';

/**
 * Map fields for BULGARIAXLS producer, XLS and XLSX file types
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/bulgaria/xls/test/stubs/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/bulgaria/xls/src/lib/transform.js|implementation details}
 *
 * @name BulgariaXlsTransform
 * @param {Object} record Piece of data to transform before going to harmonized storage.
 * @returns {Project} JSON matching the type fields.
 */
export default (record: Object): Project | null => {
  if (!record) return null;

  return {
    action: '',
    budget: getBudget(record),
    call_year: '',
    description: getProjectDescription(record),
    ec_priorities: [],
    media: [],
    third_parties: getThirdParties(record),
    programme_name: '',
    project_id: getProjectId(record),
    project_locations: getLocations(record),
    project_website: '',
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
    themes: [],
    timeframe: getTimeframe(record),
    title: getProjectTitle(record),
    type: [],
  };
};
