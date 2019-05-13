// @flow

import crypto from 'crypto';
import type { Project } from '@eubfr/types';
import getCountryCode from '@eubfr/lib/getCountryCode';
import sanitizeBudgetItem from '@eubfr/lib/budget/budgetFormatter';

/**
 * Preprocess `budget`.
 *
 * Input fields taken from the `record` are:
 * - `Total Eligible Expenditure Allocated to the Operation;Current`
 * - `Union co‑financing rate, as per priority axis;`
 *
 * @memberof 2014uk16rfop001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Budget}
 */

const getBudget = record => ({
  total_cost: sanitizeBudgetItem({
    value:
      record['Total Eligible Expenditure Allocated to the Operation;Current'],
    currency: 'GBP',
    raw:
      record['Total Eligible Expenditure Allocated to the Operation;Current'],
  }),
  eu_contrib: sanitizeBudgetItem({
    value:
      record['Total Eligible Expenditure Allocated to the Operation;Current'] *
      record['Union co‑financing rate, as per priority axis;'],
    currency: 'GBP',
    raw: record['Union co‑financing rate, as per priority axis;'],
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
 * - `Operation Summary`
 *
 * @memberof 2014uk16rfop001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getDescription = record => record['Operation Summary'] || '';

/**
 * Preprocess `project_id`.
 *
 * There are rows with overlapping information about beneficiaries and operations.
 * In order to keep them separate, as they are in the ingested file, we take into account the budgetary information as well.
 *
 * Input fields taken from the `record` are:
 * - `Operation Name`
 * - `Total Eligible Expenditure Allocated to the Operation;Current`
 *
 * @memberof 2014uk16rfop001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getProjectId = record => {
  const infoCombined =
    record['Operation Name'] +
    String(
      record['Total Eligible Expenditure Allocated to the Operation;Current']
    );

  return crypto
    .createHash('md5')
    .update(infoCombined)
    .digest('hex');
};

/**
 * Preprocess `project_locations`.
 *
 * Input fields taken from the `record` are:
 * - `Operation postcode; or other appropriate location indicator;`
 * - `Country`
 *
 * @memberof 2014uk16rfop001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<Location>}
 */

const getLocations = record => {
  let region = '';
  const locations = [];
  const country = getCountryCode(record.Country);

  const location = record[
    'Operation postcode; or other appropriate location indicator;'
  ]
    ? record[
        'Operation postcode; or other appropriate location indicator;'
      ].split('LEP')[0]
    : '';

  if (location) {
    const places = location.trim().split(/\s*(?:,|&)\s*/);

    // Check if several places are included, take only the first one.
    if (places.length && places.length > 1) {
      region = places[0].trim();
    }
    // Otherwise take whatever is before the 'LEP' clarification.
    else {
      region = location.trim();
    }
  }

  if (country) {
    locations.push({
      address: '',
      centroid: null,
      country_code: country,
      location: null,
      nuts: [],
      postal_code: '',
      region,
      town: '',
    });
  }

  return locations;
};

/**
 * Preprocess `themes`.
 *
 * Input fields taken from the `record` are:
 * - `Category of Intervention`
 *
 * @memberof 2014uk16rfop001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<String>}
 */

const getThemes = record =>
  record['Category of Intervention']
    ? [
        record['Category of Intervention']
          .trim()
          .replace(/(\r\n|\n|\r)/gm, '')
          .replace(/ {1,}/g, ' '),
      ]
    : [];

/**
 * Preprocess `third_parties`.
 *
 * Input fields taken from the `record` are:
 * - `Beneficiary Name`
 *
 * @memberof 2014uk16rfop001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<ThirdParty>}
 */

const getThirdParties = record =>
  record['Beneficiary Name']
    ? [
        {
          address: '',
          country: 'GB',
          email: '',
          name: record['Beneficiary Name']
            ? record['Beneficiary Name'].trim()
            : '',
          phone: '',
          region: '',
          role: 'Beneficiary',
          type: '',
          website: '',
        },
      ]
    : [];

/**
 * Preprocess `timeframe`.
 *
 * Input fields taken from the `record` are:
 * - `Operation Start Date`
 * - `Operation End Date`
 *
 * @memberof 2014uk16rfop001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Timeframe}
 */

const getTimeframe = record => {
  const from = record['Operation Start Date'] || null;
  const to = record['Operation End Date'] || null;

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
 * - `Operation Name`
 *
 * @memberof 2014uk16rfop001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getTitle = record =>
  record['Operation Name'] ? record['Operation Name'].trim() : '';

/**
 * Map fields for 2014uk16rfop001 producer, XLS file types, ESF funding type.
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014uk16rfop001/xls/test/stubs/ESF/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014uk16rfop001/xls/src/lib/transform/ESF/transform.js|implementation details}
 *
 * @name 2014uk16rfop001XlsTransform
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
