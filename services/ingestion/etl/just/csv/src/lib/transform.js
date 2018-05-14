// @flow

import getCountryCode from '../../../../../helpers/getCountryCode';

/*
 * Transform message (JUST CSV)
 */

import type { Project } from '../../../../_types/Project';

/**
 * Converts a single string to an array
 *
 * @memberof AgriCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array} List of string values for `funding_area` field
 *
 * @example
 * input => "Research & innovation; Investment for growth; Transport"
 * output => ["Research & innovation", "Investment for growth", "Transport"]
 */
const getFundingArea = record =>
  // Get value for 'Funding area' if property is present.
  (record['Funding area'] ? record['Funding area'].split(';') : []).filter(
    // Remove empty strings.
    item => item
  );

/**
 * Format date
 *
 * @memberof JustCsvTransform
 * @param {Date} date Date in timestamp
 * @returns {Date} The date formatted into an ISO 8601 date format
 *
 * @example
 * input => "1388530800"
 * output => "2013-12-31T23:00:00.000Z"
 */
const formatDate = date =>
  date ? new Date(parseInt(date, 10) * 1000).toISOString() : null;

/**
 * Preprocess locations
 *
 * Input fields taken from the `record` are:
 *
 * - `Project location longitude`
 * - `Project location latitude`
 * - `Project country(ies)`
 * - `Project address(es)`
 * - `Project postal code(s)`
 * - `Project town(s)`
 *
 * @memberof AgriCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array} List of {Location} objects for `project_locations` field
 */
const getLocations = record => {
  const longArray = record['Project location longitude'].split(';');
  const latArray = record['Project location latitude'].split(';');

  return record['Project country(ies)'].split(';').map((country, index) => {
    const hasCoordinates =
      Array.isArray(longArray) &&
      longArray[index] &&
      Array.isArray(latArray) &&
      latArray[index];

    return {
      country_code: getCountryCode(country),
      region: '',
      nuts: [],
      address: record['Project address(es)'] || '',
      postal_code: record['Project postal code(s)'] || '',
      town: record['Project town(s)'] || '',
      centroid: hasCoordinates
        ? {
            lat: parseFloat(latArray[index]) || 0,
            lon: parseFloat(longArray[index]) || 0,
          }
        : null,
      location: hasCoordinates
        ? {
            type: 'Point',
            coordinates: [
              parseFloat(longArray[index]) || 0,
              parseFloat(latArray[index]) || 0,
            ],
          }
        : null,
    };
  });
};

/**
 * Map fields for JUST producer, CSV file types
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/just/csv/test/stubs/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/just/csv/src/lib/transform.js|implementation details}
 * @name JustCsvTransform
 * @param {Object} record Piece of data to transform before going to harmonized storage.
 * @returns {Project} JSON matching the type fields.
 */
export default (record: Object): Project => {
  // Preprocess budget
  const budgetObject = {
    total_cost: {
      value: Number(record['Total project budget']) || 0,
      currency: '',
      raw: record['Total project budget'] || '',
    },
    eu_contrib: {
      value: Number(record['EU Budget contribution']) || 0,
      currency: 'EUR',
      raw: record['EU Budget contribution'] || '',
    },
    private_fund: { value: 0, currency: '', raw: '' },
    public_fund: { value: 0, currency: '', raw: '' },
    other_contrib: { value: 0, currency: '', raw: '' },
    funding_area: getFundingArea(record),
    mmf_heading: record['EU Budget MFF heading'] || '',
  };

  // Preprocess locations
  const locationArray = getLocations(record);

  // Preprocess results
  const resultObject = {
    available: '',
    result: record.Results || '',
  };

  // Map the fields
  return {
    action: record.field_prj_cat_actions,
    budget: budgetObject,
    call_year: record.field_prj_year,
    description: record.field_prj_summary,
    ec_priorities: [],
    media: [],
    programme_name: '',
    project_id: record.field_prj_ref_number,
    project_locations: locationArray,
    project_website: record.field_prj_website || '',
    related_links: [],
    reporting_organisation: '',
    results: resultObject,
    status: '',
    sub_programme_name: '',
    success_story: '',
    themes: [],
    third_parties: [],
    timeframe: {
      from: null,
      to: null,
    },
    title: record.title,
    type: [],
  };
};
