// @flow

import sanitizeBudgetItem from '@eubfr/lib/budgetFormatter';
import getCountryCode from '@eubfr/lib/getCountryCode';
import type { Project } from '@eubfr/types';

/**
 * Preprocess coordinators
 *
 * @memberof CordisCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array} List of {Coordinator} objects for `coordinators` field
 *
 * @example
 * input => "Eva Maria Plunger (VERBUND AG); foo; bar"
 * output => ["Eva Maria Plunger (VERBUND AG)", "foo", "bar"]
 */
const getCoordinators = record => ({
  name: record.coordinator || '',
  type: '',
  address: '',
  region: '',
  role: 'coordinator',
  country: record.coordinatorCountry || '',
  website: '',
  phone: '',
  email: '',
});

/*
 * Transform message (CORDIS CSV)
 */

/**
 * Preprocess locations
 *
 * No input fields, location is not provided
 *
 * @memberof CordisCsvTransform
 * @returns {Array} List of {Location} objects for `project_locations` field
 */
const getLocations = () => {
  const projectLongitude = '';
  const projectLatitude = '';

  const country = '';
  const hasCoordinates = projectLongitude && projectLatitude;

  return [
    {
      country_code: (country && getCountryCode(country)) || '',
      region: '',
      nuts: [],
      address: '',
      postal_code: '',
      town: '',
      centroid: hasCoordinates
        ? {
            lon: parseFloat(projectLongitude) || 0,
            lat: parseFloat(projectLatitude) || 0,
          }
        : null,
      location: hasCoordinates
        ? {
            type: 'Point',
            coordinates: [
              parseFloat(projectLongitude) || 0,
              parseFloat(projectLatitude) || 0,
            ],
          }
        : null,
    },
  ];
};

/**
 * Preprocess budget
 *
 * @memberof CordisCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Budget}
 */
const getBudget = record => ({
  total_cost: sanitizeBudgetItem({
    value: record.totalCost,
    currency: 'EUR',
    raw: record.totalCost,
  }),
  eu_contrib: sanitizeBudgetItem({
    value: record.ecMaxContribution,
    currency: 'EUR',
    raw: record.ecMaxContribution,
  }),
  private_fund: sanitizeBudgetItem(),
  public_fund: sanitizeBudgetItem(),
  other_contrib: sanitizeBudgetItem(),
  funding_area: [],
  mmf_heading: '',
});

/**
 * Map fields for CORDIS producer, CSV file types
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/cordis/csv/test/stubs/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/cordis/csv/src/lib/transform.js|implementation details}
 * @name CordisCsvTransform
 * @param {Object} record Piece of data to transform before going to harmonized storage.
 * @returns {Project} JSON matching the type fields.
 */
export default (record: Object): Project => {
  // Preprocess locations
  const locationArray = getLocations();

  // Preprocess results
  const resultObject = {
    available: '',
    result: '',
  };

  // Preprocess third parties
  const thirdPartiesArray = [getCoordinators(record)];

  // Map the fields
  return {
    action: record.fundingScheme || '',
    budget: getBudget(record),
    call_year: '',
    description: record.objective || '',
    ec_priorities: [],
    media: [],
    programme_name: record.frameworkProgramme || '',
    project_id: record.id || '',
    project_locations: locationArray,
    project_website: record.projectUrl || '',
    related_links: [
      {
        url: '',
        label: '',
      },
    ],
    reporting_organisation: 'DEVCO',
    results: resultObject,
    status: record.status || '',
    sub_programme_name: record.programme || '',
    success_story: '',
    themes: [],
    third_parties: thirdPartiesArray,
    timeframe: {
      from: record.startDate || '',
      from_precision: 'year',
      to: record.endDate || '',
      to_precision: 'year',
    },
    title: record.title || '',
    type: [],
  };
};
