// @flow

import sanitizeBudgetItem from '@eubfr/lib-budgetFormatter';
import type { Project } from '../../../../../../../types/Project';
import getCountryCode from '../../../../../helpers/getCountryCode';

/*
 * Transform message (JUST CSV)
 */

/**
 * Preprocess locations
 *
 * Input fields taken from the `record` are:
 *
 * - `field_prj_longitude`
 * - `field_prj_latitude`
 * - `field_prj_country_iso
 *
 * @memberof JustCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array} List of {Location} objects for `project_locations` field
 */
const getLocations = record => {
  const projectLongitude = record.field_prj_longitude || '';
  const projectLatitude = record.field_prj_latitude || '';

  const country = record.field_prj_country_iso;
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
 * @memberof JustCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Object}
 */
const getBudget = record => ({
  total_cost: sanitizeBudgetItem({
    value: record.field_prj_total_budget,
    currency: 'EUR',
    raw: record.field_prj_total_budget,
  }),
  eu_contrib: sanitizeBudgetItem({
    value: record.field_prj_eu_budget,
    currency: 'EUR',
    raw: record.field_prj_eu_budget,
  }),
  private_fund: sanitizeBudgetItem(),
  public_fund: sanitizeBudgetItem(),
  other_contrib: sanitizeBudgetItem(),
  funding_area: [],
  mmf_heading: '',
});

/**
 * Preprocess related links
 *
 * Depends on record['Related links'] field
 *
 * @memberof JustCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array} List of {RelatedLink}
 *
 * @example
 * input => "<a href=\"https://ec.europa.eu/inea/en/ten-t/ten-t-projects/projects-by-country/multi-country/2013-eu-92069-s\">INEA</a>;<a href=\"https://europa.eu/investeu/projects/central-european-green-corridors_en\">InvestEU</a>"
 * output => [
 *    { label: "INEA", url: "https://ec.europa.eu/inea/en/ten-t/ten-t-projects/projects-by-country/multi-country/2013-eu-92069-s" }
 *    { label: "InvestEU", url: "https://europa.eu/investeu/projects/central-european-green-corridors_en" }
 *  ]
 */
const getRelatedLinks = record =>
  (record.field_prj_link || '')
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
    action: record.field_prj_cat_actions || '',
    budget: getBudget(record),
    call_year: record.field_prj_year || '',
    description: record.field_prj_summary || '',
    ec_priorities: [],
    media: [],
    programme_name: '',
    project_id: record.field_prj_ref_number || '',
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
    title: record.title || '',
    type: [],
  };
};
