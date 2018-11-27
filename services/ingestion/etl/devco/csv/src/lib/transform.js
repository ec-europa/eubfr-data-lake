// @flow

import countries from 'i18n-iso-countries';
import getCountryCode from '@eubfr/lib/getCountryCode';
import extractBudgetData from '@eubfr/lib/budget/extractBudgetData';
import sanitizeBudgetItem from '@eubfr/lib/budget/budgetFormatter';
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
  const locations = [];

  const code = getCountryCode(getCodeByCountry(record.Country));

  const coordinates = record['GIS Localisation'].split(',');
  if (coordinates && coordinates.length > 1) {
    centroid = {
      lat: parseFloat(coordinates[0].replace(/\n/g, '')),
      lon: parseFloat(coordinates[1].replace(/\n/g, '')),
    };
  }

  if (code) {
    locations.push({
      country_code: code,
      region: record.Region || '',
      nuts: [],
      address: '',
      postal_code: '',
      town: '',
      centroid,
      location: null,
    });
  }

  return locations;
};

/**
 * Preprocess `results`
 *
 * Input fields taken from the `record` are:
 *
 * - `1.1 Access on grid electricity ('000 people)`
 * - `1.2 Access mini grid electricity ('000 people)`
 * - `1.3 Access off-grid electricity ('000 people)`
 * - `1.4 Inferred access (additional generation) ('000 people)`
 * - `1.5 Inferred access (cross-border transmission) ('000 people)`
 * - `1.6 Access to biomass/biogas clean cooking ('000 people)`
 * - `1.7 Access to LPG/ethanol cooking ('000 people)`
 * - `1.8 Electricity from renewables (GWh/year)`
 * - `1.9 Renewable generation capacity (MW)`
 * - `1.10 Electricity from energy efficiency (liberated capacity) (MW)`
 * - `1.11 Transmission lines (km)`
 * - `1.12 Distribution lines (km)`
 * - `1.13 Energy Savings (MWh/year)`
 * - `1.14 GHG emissions avoided per year (ktons CO2eq)`
 * - `1.15 No of direct jobs person/year (construction)`
 * - `1.16 No of permanent jobs \n(operation)`
 *
 * @memberof DevcoCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Result}
 */

const getResults = record => {
  let resultIsAvailable = false;
  let resultsContents = '';

  const fields = [
    "1.1 Access on grid electricity ('000 people)",
    "1.2 Access mini grid electricity ('000 people)",
    "1.3 Access off-grid electricity ('000 people)",
    "1.4 Inferred access (additional generation) ('000 people)",
    "1.5 Inferred access (cross-border transmission) ('000 people)",
    "1.6 Access to biomass/biogas clean cooking ('000 people)",
    "1.7 Access to LPG/ethanol cooking ('000 people)",
    '1.8 Electricity from renewables (GWh/year)',
    '1.9 Renewable generation capacity (MW)',
    '1.10 Electricity from energy efficiency (liberated capacity) (MW)',
    '1.11 Transmission lines (km)',
    '1.12 Distribution lines (km)',
    '1.13 Energy Savings (MWh/year)',
    '1.14 GHG emissions avoided per year (ktons CO2eq)',
    '1.15 No of direct jobs person/year (construction)',
    '1.16 No of permanent jobs \n(operation)',
  ];

  fields.forEach(field => {
    if (field in record) {
      if (record[field] !== ' n/a ') {
        const fieldLabel = field
          .slice(4)
          .replace(/\n/g, '')
          .trim();
        const fieldValue = `${fieldLabel}: ${record[field]} \n`;
        resultsContents += fieldValue;
        resultIsAvailable = 'yes';
      }
    }
  });

  const results = {
    available: resultIsAvailable || '',
    result: resultsContents,
  };

  return results;
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
    results: getResults(record),
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
