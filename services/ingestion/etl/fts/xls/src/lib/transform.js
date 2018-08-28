// @flow

import countries from 'i18n-iso-countries';
import type { Project } from '@eubfr/types';
import getCountryCode from '@eubfr/lib/getCountryCode';
import sanitizeBudgetItem from '@eubfr/lib/budgetFormatter';

/**
 * Gets country code from a country name.
 * Contains a map of exceptions.
 *
 * @memberof FtsXlsTransform
 * @param {String} countryName The name of the country
 * @returns {String} The ISO 3166-1 country code
 */
const getCodeByCountry = countryName => {
  // There are a few exceptions which should be normalized, regardless of the library
  const corrections = new Map([
    ['Tanzania', 'Tanzania, United Republic of'],
    ['Congo (Democratic Republic of)', 'Congo, the Democratic Republic of the'],
    ['Serbia (Republic of)', 'Serbia'],
    ['Occupied Territories - Palestine', 'Palestinian Territory, Occupied'],
    [
      'Macedonia (the former Yugoslav Republic of)',
      'Macedonia, the Former Yugoslav Republic of',
    ],
  ]);

  const countryNameCorrected = corrections.get(countryName) || countryName;

  return countries.getAlpha2Code(countryNameCorrected, 'en');
};

/**
 * Gets NUTS code level from a string
 *
 * @memberof FtsXlsTransform
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
 * Preprocess budget
 *
 * Input fields taken from the `record` are:
 * - `Total amount`
 * - `Funding Type`
 * - `Type`
 *
 * @memberof FtsXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Budget}
 */
const getBudget = record => {
  const fundingArea = [];
  // Use `Type` field if provided.
  if (record.Type) {
    fundingArea.push(record.Type);
  }

  // Use `Funding Type` field if provided.
  if (record['Funding Type']) {
    fundingArea.push(record['Funding Type']);
  }

  const budget = {
    eu_contrib: sanitizeBudgetItem({
      value: record['Total amount'],
      currency: 'EUR',
      raw: record['Total amount'],
    }),
    funding_area: fundingArea,
    mmf_heading: '',
    other_contrib: sanitizeBudgetItem(),
    private_fund: sanitizeBudgetItem(),
    public_fund: sanitizeBudgetItem(),
    total_cost: sanitizeBudgetItem(),
  };

  return budget;
};

/**
 * Preprocess project_locations
 * Input fields taken from the `record` are:
 * - `Address`
 * - `City`
 * - `Postal code`
 * - `Country / Territory`
 * - `NUTS2`
 * - `Geographical Zone`
 *
 * @memberof FtsXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array} List of {Location} objects for `project_locations` field
 */
const getLocations = record => {
  const locations = [];
  // 'Country / Territory' is the "driver" field for locations.
  const items = record['Country / Territory']
    ? record['Country / Territory'].split(';')
    : [];

  if (items.length === 0) {
    return locations;
  }

  // Other fields which could possibly contain location information.
  const locationFields = ['Address', 'City', 'Postal code'];

  // Populate the information known with certainty.
  items.forEach(item => {
    // Get country code from country name
    const countryCode = getCodeByCountry(item);

    const location = {
      centroid: null,
      country_code: getCountryCode(countryCode),
      location: null,
      nuts: [],
      region: '',
    };

    // It's possible that some items have this.
    // If present, use it.
    if (item.NUTS2) {
      location.nuts.push({
        code: item.NUTS2,
        name: '',
        level: getNutsCodeLevel(item.NUTS2),
        year: null,
      });
    }

    locations.push(location);
  });

  // Include information for all fields which have additional information.
  locationFields.forEach(field => {
    // If field is present.
    if (record[field]) {
      // Get values for this available field.
      const fieldValues = record[field].split(';');

      // And populate values mapping to target field names.
      switch (field) {
        case 'Address':
          fieldValues.forEach((value, key) => {
            locations[key].address = value;
          });
          break;

        case 'City':
          fieldValues.forEach((value, key) => {
            locations[key].town = value;
          });
          break;

        case 'Postal code':
          fieldValues.forEach((value, key) => {
            locations[key].postal_code = value;
          });
          break;

        default:
          break;
      }
    }
  });

  return locations;
};

/**
 * Preprocess third_parties
 *
 * Input fields taken from the `record` are:
 * - `Name of beneficiary`
 * - `Coordinator`
 * - `Address`
 * - `Country / Territory`
 *
 * @memberof FtsXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array} List of {ThirdParty} objects for `third_parties` field
 */
const getThirdParties = record => {
  const actors = [];
  const coordinators = record.Coordinator.split(';');
  const items = record['Name of beneficiary'].split(';');
  const addressItems = record.Address.split(';');
  const countryItems = record['Country / Territory'].split(';');

  items.forEach((item, key) => {
    let role = 'participant';
    let type = 'beneficiary';

    if (coordinators[key] === 'yes') {
      role = 'coordinator';
      type = '';
    }

    // Get country code from country name
    const countryCode = getCodeByCountry(countryItems[key]);

    actors.push({
      address: addressItems[key],
      country: getCountryCode(countryCode),
      email: '',
      name: items[key],
      phone: '',
      region: '',
      role,
      type,
      website: '',
    });
  });

  return actors;
};

/**
 * Map fields for FTS producer, XLS file types
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/fts/xls/test/stubs/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/fts/xls/src/lib/transform.js|implementation details}
 * @name FtsXlsTransform
 * @param {Object} record Piece of data to transform before going to harmonized storage.
 * @returns {Project} JSON matching the type fields.
 */
export default (record: Object): Project | null => {
  if (!record) return null;

  // Map the fields
  return {
    action: '',
    budget: getBudget(record),
    call_year: record.Year || '',
    description: record['Budget line name and number'] || '',
    ec_priorities: [],
    media: [],
    programme_name: record['Action Type'] || '',
    project_id: record['Commitment position key'],
    project_locations: getLocations(record),
    project_website: '',
    complete: true,
    related_links: [],
    reporting_organisation: 'BUDG',
    results: {
      available: '',
      result: '',
    },
    status: '',
    sub_programme_name: '',
    success_story: '',
    themes: [],
    third_parties: getThirdParties(record),
    timeframe: {
      from: null,
      from_precision: 'year',
      to: null,
      to_precision: 'year',
    },
    title: '',
    type: [],
  };
};
