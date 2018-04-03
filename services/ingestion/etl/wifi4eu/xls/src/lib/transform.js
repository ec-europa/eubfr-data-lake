// @flow

import crypto from 'crypto';
import getCountryCode from './getCountryCode';

import type { Project } from '../../../../_types/Project';

/**
 * Preprocess budget field. For the moment, we don't have this data.
 *
 * @memberof Wifi4EuXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Budget}
 */
const getBudget = () => ({
  total_cost: { value: 0, currency: '', raw: '' },
  eu_contrib: {
    value: 0,
    currency: 'EUR',
    raw: '',
  },
  private_fund: { value: 0, currency: '', raw: '' },
  public_fund: { value: 0, currency: '', raw: '' },
  other_contrib: { value: 0, currency: '', raw: '' },
  funding_area: [],
  mmf_heading: '',
});

/**
 * Preprocess `call_year` field. Data comes from `record['Call year']`.
 *
 * @memberof Wifi4EuXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getCallYear = record => (record['Call year'] ? record['Call year'] : '');

/**
 * Preprocess `description` field. Data comes from `record['Project Description']`.
 *
 * @memberof Wifi4EuXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getProjectDescription = record =>
  record['Project Description'] ? record['Project Description'] : '';

/**
 * Preprocess `partners` field.
 *
 * Data comes from the following source fields:
 * - `municipality name`
 *
 * @memberof Wifi4EuXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getBeneficieries = record => {
  const name = record['municipality name'] ? record['municipality name'] : '';

  return [
    {
      address: '',
      country: '',
      email: '',
      name,
      phone: '',
      region: '',
      role: 'beneficiary',
      type: '',
      website: '',
    },
  ];
};

/**
 * Helper to build an address value.
 *
 * Data comes from the following source fields:
 * - `address`
 * - `address num`
 *
 * @memberof Wifi4EuXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String} Optimistic concatenation between `address` and `address num`.
 */
const getAddress = record => {
  let address = '';

  const addressLoc = record.address ? record.address : '';
  const addressNum =
    record['address num'] !== 's/n' && undefined ? record['address num'] : '';

  // Build address based on available information.
  if (addressLoc && addressNum) {
    address = `${addressLoc} ${addressNum}`;
  } else if (addressLoc) {
    address = addressLoc;
  }

  return address;
};

/**
 * Generates values for `project_id` field since source data misses these.
 * It's needed for having separate projects in the Elasticsearch database.
 *
 * Depends on `getAddress` helper function.
 *
 * @memberof Wifi4EuXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getProjectId = record =>
  crypto
    .createHash('md5')
    .update(getAddress(record))
    .digest('hex');

/**
 * Preprocess `project_locations` field.
 * Depends on:
 * - `getAddress`
 * - `getCountryCode`
 *
 * Data comes from the following source fields:
 * - `country`
 * - `postal code`
 *
 * @memberof Wifi4EuXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<Location>}
 */
const getLocations = record => {
  const address = getAddress(record);
  const postCode = record['postal code'] ? record['postal code'] : '';

  return [
    {
      address,
      centroid: null,
      country_code: getCountryCode(record.country),
      location: null,
      nuts2: '',
      postal_code: postCode,
      region: '',
      town: '',
    },
  ];
};

/**
 * Preprocess `project_website` field. Data comes from `record.link`.
 *
 * @memberof Wifi4EuXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getProjectWebsite = record => (record.link ? record.link : '');

/**
 * Format date
 *
 * @memberof Wifi4EuXlsTransform
 * @param {Date} date Date in "10/9/14" (MM/DD/YY) or "10/9/2014" (MM/DD/YYYY) format
 * @returns {Date} The date formatted into an ISO 8601 date format
 *
 * @example
 * input => "10/9/2014"
 * output => "2014-10-09T00:00:00.000Z"
 */
const formatDate = date => {
  if (!date || typeof date !== 'string') return null;
  const d = date.split(/\//);
  if (d.length !== 3) return null;
  // If year is given as 2 digits, make it 4 digits.
  if (d[2].length === 2) d[2] = `20${d[2]}`;
  const [month, day, year] = d;
  if (!day || !month || !year) return null;
  try {
    return new Date(Date.UTC(year, month - 1, day)).toISOString();
  } catch (e) {
    return null;
  }
};

/**
 * Preprocess `timeframe` field. Data comes from `record['Date from']`.
 *
 * @memberof Wifi4EuXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Timeframe}
 */
const getProjectTimeframe = record => {
  const from = formatDate(record['Date from']);
  return { from, to: null };
};

/**
 * Preprocess `title` field. Data comes from `record['Project Title']`.
 *
 * @memberof Wifi4EuXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getProjectTitle = record =>
  record['Project Title'] ? record['Project Title'] : '';

/**
 * Map fields for WIFI4EU producer, XLS and XLSX file types
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/wifi4eu/xls/test/stubs/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/wifi4eu/xls/src/lib/transform.js|implementation details}
 * @name Wifi4EuXlsTransform
 * @param {Object} record Piece of data to transform before going to harmonized storage.
 * @returns {Project} JSON matching the type fields.
 */
export default (record: Object): Project =>
  // Map the fields
  ({
    action: '',
    budget: getBudget(),
    call_year: getCallYear(record),
    description: getProjectDescription(record),
    ec_priorities: [],
    media: {
      cover_image: '',
      video: '',
    },
    third_parties: getBeneficieries(record),
    programme_name: '',
    project_id: getProjectId(record),
    project_locations: getLocations(record),
    project_website: getProjectWebsite(record),
    related_links: [
      {
        label: '',
        url: '',
      },
    ],
    results: {
      available: '',
      result: '',
    },
    status: '',
    sub_programme_name: '',
    success_story: '',
    themes: [],
    timeframe: getProjectTimeframe(record),
    title: getProjectTitle(record),
    type: [],
  });
