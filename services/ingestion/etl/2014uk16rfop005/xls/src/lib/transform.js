// @flow

import crypto from 'crypto';

import type { Project } from '@eubfr/types';
import sanitizeBudgetItem from '@eubfr/lib/budget/budgetFormatter';

/**
 * Preprocess `budget`.
 *
 * Input fields taken from the `record` are:
 *
 * - `EU funds awarded`
 * - `Total Project cost`
 *
 * @memberof 2014uk16rfop005XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Budget}
 */

const getBudget = record => ({
  total_cost: sanitizeBudgetItem({
    value: record['Total Project cost'],
    currency: 'GBP',
    raw: record['Total Project cost'],
  }),
  eu_contrib: sanitizeBudgetItem({
    value: record['EU funds awarded'],
    currency: 'GBP',
    raw: record['EU funds awarded'],
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
 *
 * - `Project Description`
 * - `Sector`
 * - `Union co-financing rate, as per Priority Axis`
 * - `Welsh Government Targeted Match Funding, Yes / No’`
 *
 * @memberof 2014uk16rfop005XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getDescription = record => {
  let description = '';

  const fields = [
    'Project Description',
    'Sector',
    'Union co-financing rate, as per Priority Axis',
    'Welsh Government Targeted Match Funding, Yes / No’',
  ];

  fields.forEach(field => {
    description += `${field}: ${record[field]}\n`;
  });

  return description;
};

/**
 * Preprocess `ec_priorities`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Priority`
 *
 * @memberof 2014uk16rfop005XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<String>}
 */

const getPriorities = record =>
  record.Priority ? [record.Priority.trim()] : [];

/**
 * Preprocess `programme_name`.
 *
 * Input fields taken from the `record` are:
 *
 * - `EU Programme`
 *
 * @memberof 2014uk16rfop005XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getProgramme = record =>
  record['EU Programme'] ? record['EU Programme'].trim() : '';

/**
 * Preprocess `project_id`.
 *
 * Uses `Case ID`, but if it's not present, the ID is generated based on `Project Title`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Case ID`
 * - `Project Title`
 *
 * @memberof 2014uk16rfop005XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getProjectId = record =>
  record['Case ID']
    ? String(record['Case ID']).trim()
    : crypto
        .createHash('md5')
        .update(record['Project Title'])
        .digest('hex');

/**
 * Preprocess `project_locations`.
 *
 * Adds a default value of GB, because data is related to Wales.
 *
 * Input fields taken from the `record` are:
 *
 * - `Regional area(s)`
 *
 * @memberof 2014uk16rfop005XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<Location>}
 */

const getLocations = record => {
  const locations = [];
  const regions = record['Regional area(s)']
    ? record['Regional area(s)']
        .split(',')
        .filter(r => r)
        .map(r => r.trim())
    : [];

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
 * - `Category of intervention`
 *
 * @memberof 2014uk16rfop005XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<String>}
 */

const getThemes = record =>
  record['Category of intervention']
    ? [record['Category of intervention'].trim()]
    : [];

/**
 * Preprocess `third_parties`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Lead Organisation`
 * - `Joint Sponsors`
 *
 * @memberof 2014uk16rfop005XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<ThirdParty>}
 */

const getThirdParties = record => {
  const thirdParties = [];

  const leader = record['Lead Organisation']
    ? record['Lead Organisation'].trim()
    : '';

  const sponsors = record['Joint Sponsors']
    ? record['Joint Sponsors']
        .split(';')
        .filter(p => p)
        .map(p => p.trim())
    : [];

  sponsors.forEach(sponsor => {
    thirdParties.push({
      address: '',
      country: '',
      email: '',
      name: sponsor,
      phone: '',
      region: '', // We store regions in locations, as number of third parties does not match the number of regions.
      role: 'Joint Sponsor',
      type: '',
      website: '',
    });

    if (leader) {
      thirdParties.push({
        address: '',
        country: '',
        email: '',
        name: leader,
        phone: '',
        region: '', // We store regions in locations, as number of third parties does not match the number of regions.
        role: 'Lead Organisation',
        type: '',
        website: '',
      });
    }
  });

  return thirdParties;
};

/**
 * Preprocess `timeframe`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Project start date`
 * - `Project end date`
 *
 * @memberof 2014uk16rfop005XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Timeframe}
 */

const getTimeframe = record => {
  const from = record['Project start date'] || null;
  const to = record['Project end date'] || null;

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
 *
 * - `Project Title`
 *
 * @memberof 2014uk16rfop005XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getTitle = record =>
  record['Project Title'] ? record['Project Title'].trim() : '';

/**
 * Map fields for 2014uk16rfop005 producer, XLS file types
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014uk16rfop005/xls/test/stubs/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014uk16rfop005/xls/src/lib/transform.js|implementation details}
 *
 * @name 2014uk16rfop005XlsTransform
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
    programme_name: getProgramme(record),
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
