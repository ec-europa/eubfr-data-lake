// @flow

import crypto from 'crypto';
import sanitizeBudgetItem from '@eubfr/lib/budget/budgetFormatter';
import type { Project } from '@eubfr/types';

/**
 * Preprocess `budget`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Total eligible expenditure allocated to the operation`
 * - `Union co-financing rate in %`
 *
 * @memberof 2014tc16rftn003XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Budget}
 */

const getBudget = record => {
  let euContrib = 0;

  if (
    record['Total eligible expenditure allocated to the operation'] &&
    record['Union co-financing rate in %']
  ) {
    euContrib =
      (record['Total eligible expenditure allocated to the operation'] *
        record['Union co-financing rate in %']) /
      100;
  }

  return {
    total_cost: sanitizeBudgetItem({
      value: record['Total eligible expenditure allocated to the operation'],
      currency: 'EUR',
      raw: record['Total eligible expenditure allocated to the operation'],
    }),
    eu_contrib: sanitizeBudgetItem({
      value: euContrib,
      currency: 'EUR',
      raw: record['Union co-financing rate in %'],
    }),
    private_fund: sanitizeBudgetItem(),
    public_fund: sanitizeBudgetItem(),
    other_contrib: sanitizeBudgetItem(),
    funding_area: [],
    mmf_heading: '',
  };
};

/**
 * Preprocess `description`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Priority axis`
 * - `Operation summary`
 * - `Programme & operation specific objective`
 * - `Union co-financing rate in % (average as in CP)`
 *
 * @memberof 2014tc16rftn003XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getDescription = record => {
  let description = '';

  const fields = [
    'Priority axis',
    'Operation summary',
    'Programme & operation specific objective',
    'Union co-financing rate in % (average as in CP)',
  ];

  fields.forEach(field => {
    description += `${field}: ${record[field]}\n`;
  });

  return description;
};

/**
 * Preprocess `project_id`.
 *
 * Input fields taken from the `record` are:
 * - `Operation name`
 *
 * @memberof 2014tc16rftn003XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getProjectId = record =>
  record['Operation name']
    ? crypto
        .createHash('md5')
        .update(String(record['Operation name']))
        .digest('hex')
    : '';

/**
 * Gets NUTS code level from a string.
 *
 * @memberof 2014tc16rftn003XlsTransform
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
 * Preprocess `project_locations`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Country`
 * - `Town`
 * - `Operation postcode`
 * - `NUTS1`
 * - `NUTS2`
 * - `NUTS3`
 *
 * @memberof 2014tc16rftn003XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<Location>}
 */

const getLocations = record => {
  const locations = [];
  const data = {};

  // Which desired piece of information is available in which property of `record`.
  const map = {
    countries: 'Country',
    postCodes: 'Operation postcode',
    towns: 'Town',
    NUTS1: 'NUTS1',
    NUTS2: 'NUTS2',
    NUTS3: 'NUTS3',
  };

  // Use the map to populate the data.
  Object.keys(map).forEach(field => {
    const prop = map[field];
    const values = record[prop]
      .split(';')
      .filter(p => p)
      .map(p => p.trim());
    data[field] = values;
  });

  data.countries.forEach((country, key) => {
    const countryCode = country.split(' ')[0];
    const postCode = data.postCodes[key];
    const town = data.towns[key];
    const nuts = [];

    ['NUTS1', 'NUTS2', 'NUTS3'].forEach(nutsCode => {
      const code = data[nutsCode][key].split(' ')[0];

      nuts.push({
        code,
        name: '',
        level: getNutsCodeLevel(code),
        year: null,
      });
    });

    locations.push({
      address: '',
      centroid: null,
      country_code: countryCode,
      location: null,
      nuts,
      postal_code: postCode,
      region: '',
      town,
    });
  });

  return locations;
};

/**
 * Preprocess `themes`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Programme's investment priority / thematic priority`
 *
 * @memberof 2014tc16rftn003XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<String>}
 */

const getThemes = record =>
  record["Programme's investment priority / thematic priority"]
    ? record["Programme's investment priority / thematic priority"]
        .split(',')
        .filter(a => a)
        .map(a => a.trim())
        .map(a => a.replace(/(\r\n|\n|\r)/gm, ''))
        .map(a => a.replace(/ {1,}/g, ' '))
    : [];

/**
 * Preprocess `third_parties`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Country`
 * - `Beneficiary name in English`
 * - `Has the lead of the operation (Y/N)`
 *
 * @memberof 2014tc16rftn003XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<ThirdParty>}
 */

const getThirdParties = record => {
  const thirdParties = [];

  const actors = record['Beneficiary name in English']
    ? record['Beneficiary name in English']
        .split(';')
        .filter(a => a)
        .map(a => a.trim())
    : [];

  const countries = record.Country.split(';')
    .filter(c => c)
    .map(c => c.trim());

  const isLeader = record['Has the lead of the operation (Y/N)']
    .split(';')
    .filter(c => c);

  if (actors.length) {
    actors.forEach((name, key) => {
      const country = countries[key].split(' ')[1];
      const role = isLeader[key] === 'Y' ? 'Leader' : 'Partner';

      thirdParties.push({
        address: '',
        country,
        email: '',
        name,
        phone: '',
        region: '',
        role,
        type: '',
        website: '',
      });
    });
  }

  return thirdParties;
};

/**
 * Preprocess/format date.
 *
 * @memberof 2014tc16rftn003XlsTransform
 * @param {Date} date Date
 *
 * Supported formats:
 *
 * - `DD/MM/YYYY`
 *
 * @returns {Date} The date formatted into an ISO 8601 date format
 *
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
 * Preprocess `timeframe`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Operation start date`
 * - `Operation end date`
 *
 * @memberof 2014tc16rftn003XlsTransform
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
 * @memberof 2014tc16rftn003XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getTitle = record =>
  record['Operation name'] ? record['Operation name'].trim() : '';

/**
 * Map fields for 2014tc16rftn003 producer, XLS file types
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014tc16rftn003/xls/test/stubs/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014tc16rftn003/xls/src/lib/transform.js|implementation details}
 *
 * @name 2014tc16rftn003XlsTransform
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
