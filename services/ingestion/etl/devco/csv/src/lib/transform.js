// @flow

import countries from 'i18n-iso-countries';
import getCountryCode from '@eubfr/lib/getCountryCode';
import extractBudgetData from '@eubfr/lib/extractBudgetData';
import sanitizeBudgetItem from '@eubfr/lib/budgetFormatter';
import type { Project } from '@eubfr/types';

/*
 * Transform message (DEVCO CSV)
 */

/**
 * Preprocess `budget`
 *
 * Input fields taken from the `record` are:
 * - `Total Budget\n(Million Euro)`
 * - `Total EU Contribution \n(Million Euro)`
 *
 * @memberof DevcoCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Budget}
 */

const getBudget = record => {
  const euContrib = extractBudgetData(
    `${record['Total EU Contribution \n(Million Euro)']} million EUR`
  );

  const totalCost = extractBudgetData(
    `${record['Total Budget\n(Million Euro)']} million EUR`
  );

  const budget = {
    eu_contrib: sanitizeBudgetItem({
      value: euContrib.value,
      currency: 'EUR',
      raw: record['Total EU Contribution \n(Million Euro)'],
    }),
    funding_area: [],
    mmf_heading: '',
    other_contrib: sanitizeBudgetItem(),
    private_fund: sanitizeBudgetItem(),
    public_fund: sanitizeBudgetItem(),
    total_cost: sanitizeBudgetItem({
      value: totalCost.value,
      currency: 'EUR',
      raw: record['Total Budget\n(Million Euro)'],
    }),
  };

  return budget;
};

/**
 * Gets country code from a country name.
 *
 * @memberof DevcoCsvTransform
 * @param {String} countryName The name of the country
 * @returns {String} The ISO 3166-1 country code
 */

const getCodeByCountry = countryName =>
  countries.getAlpha2Code(countryName, 'en');

/**
 * Preprocess `project_locations`
 *
 * Input fields taken from the `record` are:
 * - `Country`
 * - `Region`
 * - `GIS Localisation`
 *
 * @memberof DevcoCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array}
 */

const getLocations = record => {
  let centroid = null;

  const code = getCountryCode(getCodeByCountry(record.Country));

  const coordinates = record['GIS Localisation'].split(',');
  if (coordinates && coordinates.length > 1) {
    centroid = {
      lat: parseFloat(coordinates[0].replace(/\n/g, '')),
      lon: parseFloat(coordinates[1].replace(/\n/g, '')),
    };
  }

  return [
    {
      country_code: code,
      region: record.Region || '',
      nuts: [],
      address: '',
      postal_code: '',
      town: '',
      centroid,
      location: null,
    },
  ];
};

/**
 * Preprocess `type`
 *
 * @memberof DevcoCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array} Project types
 */

const getType = record =>
  record['Project Type'] ? [record['Project Type']] : [];

/**
 * Map fields for DEVCO producer, CSV file types
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/devco/csv/test/stubs/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/devco/csv/src/lib/transform.js|implementation details}
 * @name DevcoCsvTransform
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
    description: record['Description and main objectives'] || '',
    ec_priorities: [],
    media: [],
    programme_name: record['Funding Source'] || '',
    project_id: record.ID,
    project_locations: getLocations(record),
    project_website: '',
    complete: true,
    related_links: [],
    reporting_organisation: 'DEVCO',
    results: {
      available: '',
      result: '',
    },
    status: record['Contract Status'] || '',
    sub_programme_name: '',
    success_story: '',
    themes: [],
    third_parties: [],
    timeframe: {
      from: record['Starting Date']
        ? new Date(record['Starting Date']).toISOString()
        : null,
      from_precision: 'year',
      to: record['Ending Date']
        ? new Date(record['Ending Date']).toISOString()
        : null,
      to_precision: 'year',
    },
    title: record['Project Title'] || '',
    type: getType(record),
  };
};
