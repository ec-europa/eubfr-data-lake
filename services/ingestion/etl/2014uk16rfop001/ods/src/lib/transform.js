// @flow

import crypto from 'crypto';
import type { Project } from '@eubfr/types';
import sanitizeBudgetItem from '@eubfr/lib/budget/budgetFormatter';

/**
 * Preprocess `budget`.
 *
 * Input fields taken from the `record` are:
 * - `Aid element £`
 *
 * @memberof 2014uk16rfop001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Budget}
 */

const getBudget = record => ({
  total_cost: sanitizeBudgetItem({
    value: record['Aid element £'],
    currency: 'GBP',
    raw: record['Aid element £'],
  }),
  eu_contrib: sanitizeBudgetItem(),
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
 * - `Beneficiary identifier (E-claims ref)`
 * - `Sector NACE group level`
 * - `SANI reference of the aid measure`
 * - `Objective of the aid`
 *
 * @memberof 2014uk16rfop001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getDescription = record => {
  let description = '';

  const fields = [
    'Beneficiary identifier (E-claims ref)',
    'Sector NACE group level',
    'SANI reference of the aid measure',
    'Objective of the aid',
  ];

  fields.forEach(descriptionField => {
    description += `${descriptionField}: ${record[descriptionField]} \n`;
  });

  return description;
};

/**
 * Preprocess `project_id`.
 *
 * Input fields taken from the `record` are:
 * - `Objective of the aid`
 *
 * @memberof 2014uk16rfop001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getProjectId = record =>
  record['Objective of the aid']
    ? crypto
        .createHash('md5')
        .update(record['Objective of the aid'])
        .digest('hex')
    : '';

/**
 * Preprocess `project_locations`.
 *
 * Input fields taken from the `record` are:
 * - `Location of Benficiary NUTS level II (drop down)`
 *
 * @memberof 2014uk16rfop001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<Location>}
 */

const getLocations = record => [
  {
    address: '',
    centroid: null,
    country_code: 'GB',
    location: null,
    nuts: record['Location of Benficiary NUTS level II (drop down)']
      ? [
          {
            code: record['Location of Benficiary NUTS level II (drop down)'],
            name: '',
            level: 2,
            year: null,
          },
        ]
      : [],
    postal_code: '',
    region: '',
    town: '',
  },
];

/**
 * Preprocess `third_parties`.
 *
 * Input fields taken from the `record` are:
 * - `Name of beneficiary`
 *
 * @memberof 2014uk16rfop001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<ThirdParty>}
 */

const getThirdParties = record =>
  record['Name of beneficiary']
    ? [
        {
          address: '',
          country: 'GB',
          email: '',
          name: record['Name of beneficiary']
            ? record['Name of beneficiary'].trim()
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
 * - `Date of granting`
 *
 * @memberof 2014uk16rfop001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Timeframe}
 */

const getTimeframe = record => {
  const from = record['Date of granting'] || null;

  return {
    from,
    from_precision: 'day',
    to: null,
    to_precision: 'day',
  };
};

/**
 * Map fields for 2014uk16rfop001 producer, XLS file types
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014uk16rfop001/ods/test/stubs/ESF/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014uk16rfop001/ods/src/lib/transform/ESF/transform.js|implementation details}
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
    themes: [],
    third_parties: getThirdParties(record),
    timeframe: getTimeframe(record),
    title: 'European Regional Development Fund State Aid',
    type: [],
  };
};
