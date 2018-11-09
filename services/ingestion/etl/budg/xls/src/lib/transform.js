// @flow

import sanitizeBudgetItem from '@eubfr/lib/budgetFormatter';
import getCountryCode from '@eubfr/lib/getCountryCode';
import type { Project } from '@eubfr/types';

/**
 * Preprocess coordinators
 *
 * Input fields taken from the `record` are:
 *
 * - `Coordinator's name`
 * - `Coordinator organisation type`
 * - `Coordinator's address`
 * - `Coordinator's region`
 * - `Coordinator's country`
 * - `Coordinator's website`
 *
 * @memberof BudgXlsTransform
 * @param {Object} record The row received from harmonized storage
 * @returns {Array} A list with a single {Coordinator} object
 */
const getCoordinators = record => [
  {
    name: record["Coordinator's name"] || '',
    type: record['Coordinator organisation type'] || '',
    address: record["Coordinator's address"] || '',
    region: record["Coordinator's region"] || '',
    role: 'coordinator',
    country: record["Coordinator's country"] || '',
    website: record["Coordinator's website"] || '',
    phone: '',
    email: '',
  },
];

/**
 * Format date
 *
 * @memberof BudgXlsTransform
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
 * Preprocess `title`
 * Input fields taken from the `record` are:
 * - `Project Title`
 *
 * @memberof BudgXlsTransform
 * @param {Object} record The row received from harmonized storage
 * @returns {String}
 */
const getProjectTitle = record => record['Project Title'] || '';

/**
 * Preprocess partners
 *
 * Input fields taken from the `record` are:
 *
 * - `Partner {n} name`
 * - `Partner {n} organisation type`
 * - `Partner {n} address`
 * - `Partner {n} region`
 * - `Partner {n} country`
 * - `Partner {n} website`
 *
 * @memberof BudgXlsTransform
 * @param {Object} record The row received from harmonized storage
 * @returns {Array} A list of {Partner} objects
 */
const getPartners = record => {
  const partnerKeys = Object.keys(record).filter(elem => {
    const re = new RegExp('Partner ' + '([0-9]{1,2})' + ' name', 'g'); // eslint-disable-line
    return elem.match(re);
  });

  const partnerArray = [];
  for (let i = 1; i <= partnerKeys.length; i += 1) {
    if (record[`Partner ${i} name`]) {
      partnerArray.push({
        name: record[`Partner ${i} name`],
        type: record[`Partner ${i} organisation type`],
        address: record[`Partner ${i} address`],
        region: record[`Partner ${i} region`],
        role: 'partner',
        country: record[`Partner ${i} country`],
        website: record[`Partner ${i} website`] || '',
        phone: '',
        email: '',
      });
    }
  }

  return partnerArray;
};

/**
 * Preprocess locations
 *
 * Input fields taken from the `record` are:
 *
 * - `Participating countries`
 *
 * @memberof BudgXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array} List of {Location} objects for `project_locations` field
 */
const getLocations = record =>
  record['Participating countries']
    .split(',')
    .filter(loc => loc)
    .map(country => ({
      address: '',
      centroid: null,
      country_code: getCountryCode(country),
      location: null,
      nuts: [],
      postal_code: '',
      region: '',
      town: '',
    }));

/**
 * Preprocess `project_id`
 * Seeks for values in the following precedence:
 * - `Project Number`
 *
 * @memberof BudgXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getProjectId = record => record['Project Number'] || '';

/**
 * Preprocess `call_year`
 * Seeks for values in the following precedence:
 * - `Call year`
 *
 * @memberof BudgXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getCallYear = record => record['Call year'] || '';

/**
 * Preprocess `description`
 * Seeks for values in the following precedence:
 * - `Project Summary`
 *
 * @memberof BudgXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getDescription = record => record['Project Summary'] || '';

/**
 * Preprocess `project_website`
 * Seeks for values in the following precedence:
 * - `Project Website`
 *
 * @memberof BudgXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getProjectWebsite = record => record['Project Website'] || '';

/**
 *
 * Converts a single string with commas to an array
 *
 * Input fields taken from the `record` are:
 *
 * - `Activity type`
 *
 * @memberof BudgXlsTransform
 * @param {Object} record The row received from harmonized storage
 * @returns {Array} List of activity types
 *
 * @example
 * input => "foo, bar, baz"
 * output => ["foo", "bar", "baz"]
 */
const getTypes = record =>
  (record['Activity type'] != null &&
    record['Activity type'] != '' &&
    record['Activity type'].split(',')) ||
  [];

/**
 * Preprocess `status`
 * Seeks for values in the following precedence:
 * - `Project Status`
 *
 * @memberof BudgXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getProjectStatus = record => record['Project Status'] || '';

/**
 * Preprocess `sub_programme_name`
 * Seeks for values in the following precedence:
 * - `Sub-programme`
 *
 * @memberof BudgXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getSubProgramme = record => record['Sub-programme'] || '';

/**
 * Preprocess `success_story`
 * Seeks for values in the following precedence:
 * - `Is Success Story`
 *
 * @memberof BudgXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getSuccessStory = record => record['Is Success Story'] || '';

/**
 * Get end date before formatting.
 *
 * Input fields taken from the `record` are:
 * - `Start Date`
 *
 * @memberof BudgXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getStartDate = record => record['Start date'] || null;

/**
 * Get end date before formatting.
 *
 * Input fields taken from the `record` are:
 * - `End Date`
 *
 * @memberof BudgXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getEndDate = record => record['End date'] || null;

/**
 * Map fields for BUDG producer, XLS file types
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/budg/xls/test/stubs/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/budg/xls/src/lib/transform.js|implementation details}
 * @name BudgXlsTransform
 * @param {Object} record Piece of data to transform before going to harmonized storage.
 * @returns {Project} JSON matching the type fields.
 */
export default (record: Object): Project | null => {
  if (!record) return null;

  // Preprocess budget
  const budgetObject = {
    total_cost: sanitizeBudgetItem(),
    eu_contrib: sanitizeBudgetItem({
      value: record[
        "EU Grant award in euros (This amount represents the grant awarded after the selection stage and is indicative. Please note that any changes made during or after the project's lifetime will not be reflected here.)"
      ].replace(/,/g, ''),
      currency: 'EUR',
      raw:
        record[
          "EU Grant award in euros (This amount represents the grant awarded after the selection stage and is indicative. Please note that any changes made during or after the project's lifetime will not be reflected here.)"
        ],
    }),
    private_fund: sanitizeBudgetItem(),
    public_fund: sanitizeBudgetItem(),
    other_contrib: sanitizeBudgetItem(),
    funding_area: [],
    mmf_heading: '',
  };

  // Preprocess third parties
  const thirdPartiesArray = getCoordinators(record).concat(getPartners(record));

  // Preprocess locations
  const locationArray = getLocations(record);

  // Preprocess results
  const resultObject = {
    available: record['Results Available'],
    result: record['Results Platform Project Card'],
  };

  // Preprocess type
  const typeArray = getTypes(record);

  // Map the fields
  return {
    action: record.Action,
    budget: budgetObject,
    call_year: getCallYear(record),
    description: getDescription(record),
    ec_priorities: [],
    media: [],
    programme_name: record.Programme,
    project_id: getProjectId(record),
    project_locations: locationArray,
    project_website: getProjectWebsite(record),
    complete: true,
    related_links: [],
    reporting_organisation: 'BUDG',
    results: resultObject,
    status: getProjectStatus(record),
    sub_programme_name: getSubProgramme(record),
    success_story: getSuccessStory(record),
    themes: [],
    third_parties: thirdPartiesArray || [],
    timeframe: {
      from: formatDate(getStartDate(record)),
      from_precision: 'day',
      to: formatDate(getEndDate(record)),
      to_precision: 'day',
    },
    title: getProjectTitle(record),
    type: typeArray,
  };
};
