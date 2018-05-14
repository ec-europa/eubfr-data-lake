// @flow

import getCountryCode from '../../../../../helpers/getCountryCode';

/*
 * Transform message (JUST CSV)
 */

import type { Project } from '../../../../_types/Project';

const getFundingArea = record => [];

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
 * - `Project country`
 *
 * @memberof AgriCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array} List of {Location} objects for `project_locations` field
 */
const getLocations = record => {
  const projectLongitude = record['field_prj_longitude'] || '';
  const projectLatitude = record['field_prj_latitude'] || '';

  const country = record['field_prj_country_iso'];
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
 * Preprocess related links
 *
 * Depends on record['Related links'] field
 *
 * @memberof AgriCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array|Object} List of {RelatedLink}
 *
 * @example
 * input => "<a href=\"https://ec.europa.eu/inea/en/ten-t/ten-t-projects/projects-by-country/multi-country/2013-eu-92069-s\">INEA</a>;<a href=\"https://europa.eu/investeu/projects/central-european-green-corridors_en\">InvestEU</a>"
 * output => [
 *    { label: "INEA", url: "https://ec.europa.eu/inea/en/ten-t/ten-t-projects/projects-by-country/multi-country/2013-eu-92069-s" }
 *    { label: "InvestEU", url: "https://europa.eu/investeu/projects/central-european-green-corridors_en" }
 *  ]
 */
const getRelatedLinks = record =>
  (record['field_prj_link'] || '')
    .split(';')
    .filter(link => link)
    .map(link => {
      const matches = link.match(/<a .*href="(.*)".*>(.*)<\/a>/i);

      if (Array.isArray(matches) && matches.length === 3) {
        return {
          url: matches[1],
          label: matches[2],
        };
      }

      return {
        url: '',
        label: '',
      };
    })
    .filter(link => link !== null);

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
      value: Number(record['field_prj_total_budget']) || 0,
      currency: '',
      raw: record['field_prj_total_budget'] || '',
    },
    eu_contrib: {
      value: Number(record['field_prj_eu_budget']) || 0,
      currency: 'EUR',
      raw: record['field_prj_eu_budget'] || '',
    },
    private_fund: { value: 0, currency: '', raw: '' },
    public_fund: { value: 0, currency: '', raw: '' },
    other_contrib: { value: 0, currency: '', raw: '' },
    funding_area: getFundingArea(record),
    mmf_heading: '',
  };

  // Preprocess locations
  const locationArray = getLocations(record);

  // Preprocess related links
  const links = getRelatedLinks(record);

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
    related_links: links,
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
