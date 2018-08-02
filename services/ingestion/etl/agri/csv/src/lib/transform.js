// @flow

import sanitizeBudgetItem from '@eubfr/lib/budgetFormatter';
import getCountryCode from '@eubfr/lib/getCountryCode';
import type { Project } from '@eubfr/types';

/*
 * Transform message (AGRI CSV)
 */

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
 * Preprocess coordinators
 *
 * @memberof AgriCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array} List of {Coordinator} objects for `coordinators` field
 *
 * @example
 * input => "Eva Maria Plunger (VERBUND AG); foo; bar"
 * output => ["Eva Maria Plunger (VERBUND AG)", "foo", "bar"]
 */
const getCoordinators = record =>
  record.Coordinators.split(';')
    .filter(coordinator => coordinator)
    .map(coordinator => ({
      name: coordinator,
      type: '',
      address: '',
      region: '',
      role: 'coordinator',
      country: '',
      website: '',
      phone: '',
      email: '',
    }));

/**
 * Preprocess partners
 *
 * @memberof AgriCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array} List of {Partner} objects for `partners` field
 *
 * @example
 * input => "foo, bar, baz"
 * output => ["foo", "bar", "baz"]
 */
const getPartners = record =>
  record.Partners.split(',')
    .filter(partner => partner)
    .map(partner => ({
      name: partner,
      type: '',
      address: '',
      region: '',
      role: 'partner',
      country: '',
      website: '',
      phone: '',
      email: '',
    }));

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
  (record['Related links'] || '')
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
 * Format date
 *
 * @memberof AgriCsvTransform
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
 * Prepare media information
 *
 * @memberof AgriCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<Media>}
 *
 * */
const getMedia = record => {
  const media = [];
  if (record.Visual) {
    media.push({
      name: record.Visual,
      url: record.Visual,
      meta: {
        description: '',
        mime_type: '',
        type: 'visual',
      },
    });
  }
  if (record['Link to a video']) {
    media.push({
      name: record['Link to a video'] || '',
      url: record['Link to a video'] || '',
      meta: {
        description: '',
        mime_type: '',
        type: 'video',
      },
    });
  }
  return media;
};

/**
 * Map fields for AGRI producer, CSV file types
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/agri/csv/test/stubs/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/agri/csv/src/lib/transform.js|implementation details}
 * @name AgriCsvTransform
 * @param {Object} record Piece of data to transform before going to harmonized storage.
 * @returns {Project} JSON matching the type fields.
 */
export default (record: Object): Project | null => {
  if (!record) return null;

  // Preprocess budget
  const budgetObject = {
    total_cost: sanitizeBudgetItem({
      value: record['Total project budget'],
      currency: 'EUR',
      raw: record['Total project budget'],
    }),
    eu_contrib: sanitizeBudgetItem({
      value: record['EU Budget contribution'],
      currency: 'EUR',
      raw: record['EU Budget contribution'],
    }),
    private_fund: sanitizeBudgetItem(),
    public_fund: sanitizeBudgetItem(),
    other_contrib: sanitizeBudgetItem(),
    funding_area: getFundingArea(record),
    mmf_heading: record['EU Budget MFF heading'] || '',
  };

  // Preprocess third parties
  const thirdPartiesArray = getCoordinators(record).concat(getPartners(record));

  // Preprocess locations
  const locationArray = getLocations(record);

  // Preprocess related links
  const links = getRelatedLinks(record);

  // Preprocess results
  const resultObject = {
    available: '',
    result: record.Results || '',
  };

  // Preprocess timeframe
  let timeframeFrom = null;
  let timeframeTo = null;

  if (record['Timeframe start'].indexOf(' to ') !== -1) {
    const timeframe = (record['Timeframe start'] || '').split(' to ');

    if (Array.isArray(timeframe) && timeframe.length === 2) {
      [timeframeFrom, timeframeTo] = timeframe;
    }
  } else {
    timeframeFrom = record['Timeframe start'];
    timeframeTo = record['Timeframe end'];
  }

  // Map the fields
  return {
    action: '',
    budget: budgetObject,
    call_year: '',
    description: record['Project description'] || '',
    ec_priorities:
      record['EC’s priorities'].split(';').filter(priority => priority) || [],
    media: getMedia(record),
    programme_name: record['Programme name'] || '',
    project_id: record.Nid || '',
    project_locations: locationArray,
    project_website: record['Project webpage'] || '',
    public: true,
    related_links: links,
    reporting_organisation: 'AGRI',
    results: resultObject,
    status: '',
    sub_programme_name: '',
    success_story: '',
    themes: [],
    third_parties: thirdPartiesArray || [],
    timeframe: {
      from: formatDate(timeframeFrom),
      from_precision: 'day',
      to: formatDate(timeframeTo),
      to_precision: 'day',
    },
    title: record.Name || '',
    type: [],
  };
};
