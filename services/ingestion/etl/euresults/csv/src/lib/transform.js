// @flow

import sanitizeBudgetItem from '@eubfr/lib/budget/budgetFormatter';
import getCountryCode from '@eubfr/lib/getCountryCode';
import type { Project } from '@eubfr/types';

/**
 * Preprocess values for `funding_area` used in `budget`.
 *
 * @memberof euResultsCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array}
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
 * Preprocess `budget` field.
 *
 * Input fields taken from the `record` are:
 *
 * - `Total project budget`
 * - `EU Budget contribution`
 * - `EU Budget MFF heading`
 *
 * @memberof euResultsCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Budget}
 */
const getBudget = record => ({
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
});

/**
 * Preprocess `description` field.
 *
 * Input fields taken from the `record` are:
 * - `Project description`
 *
 * @memberof euResultsCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getDescription = record => record['Project description'] || '';

/**
 * Preprocess `ec_priorities` field.
 *
 * Input fields taken from the `record` are:
 * - `EC’s priorities`
 *
 * @memberof euResultsCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getPriorities = record =>
  record['EC’s priorities'].split(';').filter(priority => priority) || [];

/**
 * Preprocess `media` field.
 *
 * Input fields taken from the `record` are:
 * - `Visual`
 * - `Link to a video`
 *
 * @memberof euResultsCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<Media>}
 */
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
 * Preprocess `programme_name` field.
 *
 * Input fields taken from the `record` are:
 * - `Programme name`
 *
 * @memberof euResultsCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getProgramme = record => record['Programme name'] || '';

/**
 * Preprocess `project_id` field.
 *
 * Input fields taken from the `record` are:
 * - `Nid`
 *
 * @memberof euResultsCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getId = record => record.Nid || '';

/**
 * Preprocess `project_locations` field.
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
 * @memberof euResultsCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<Location>}
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
 * Preprocess `project_website` field.
 *
 * Input fields taken from the `record` are:
 * - `Project webpage`
 *
 * @memberof euResultsCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getWebsite = record => record['Project webpage'] || '';

/**
 * Preprocess `related_links` field.
 *
 * Input fields taken from the `record` are:
 * - `Related links`
 *
 * @memberof euResultsCsvTransform
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
 * Preprocess `reporting_organisation` field.
 *
 * Input fields taken from the `record` are:
 * - `Author`
 *
 * @memberof euResultsCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getReportingOrganisation = record => record.Author || '';

/**
 * Preprocess `results` field.
 *
 * Input fields taken from the `record` are:
 * - `Results`
 *
 * @memberof euResultsCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Result}
 */
const getResults = record => ({
  available: '',
  result: record.Results || '',
});

/**
 * Preprocess coordinators for `third_parties` field.
 *
 * Input fields taken from the `record` are:
 * - `Coordinators`
 *
 * @memberof euResultsCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<Coordinator>}
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
 * Preprocess partners for `third_parties` field.
 *
 * Input fields taken from the `record` are:
 * - `Partners`
 *
 * @memberof euResultsCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<Partner>}
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
 * Preprocess `third_parties` field.
 *
 * @memberof euResultsCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<ThirdParty>}
 */
const getThirdParties = record => {
  return getCoordinators(record).concat(getPartners(record)) || [];
};

/**
 * Formats date.
 *
 * @memberof euResultsCsvTransform
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
 * Preprocess `timeframe` field.
 *
 * Input fields taken from the `record` are:
 * - `Timeframe start`
 * - `Timeframe end`
 *
 * @memberof euResultsCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Timeframe}
 */
const getTimeframe = record => {
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

  return {
    from: formatDate(timeframeFrom),
    from_precision: 'day',
    to: formatDate(timeframeTo),
    to_precision: 'day',
  };
};

/**
 * Preprocess `title` field.
 *
 * Input fields taken from the `record` are:
 * - `Name`
 *
 * @memberof euResultsCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getTitle = record => record.Name || '';

/**
 * Map fields for EU Results producer, CSV file types
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/euresults/csv/test/stubs/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/euresults/csv/src/lib/transform.js|implementation details}
 * @name euResultsCsvTransform
 * @param {Object} record Piece of data to transform before going to harmonized storage.
 * @returns {Project} JSON matching the type fields.
 */
export default (record: Object): Project | null => {
  if (!record) return null;

  return {
    action: '',
    budget: getBudget(record),
    call_year: '',
    comments: '',
    description: getDescription(record),
    ec_priorities: getPriorities(record),
    media: getMedia(record),
    programme_name: getProgramme(record),
    project_id: getId(record),
    project_locations: getLocations(record),
    project_website: getWebsite(record),
    complete: true,
    related_links: getRelatedLinks(record),
    reporting_organisation: getReportingOrganisation(record),
    results: getResults(record),
    status: '',
    sub_programme_name: '',
    success_story: '',
    themes: [],
    third_parties: getThirdParties(record),
    timeframe: getTimeframe(record),
    title: getTitle(record),
    type: [],
  };
};
