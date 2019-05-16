// @flow

import sanitizeBudgetItem from '@eubfr/lib/budget/budgetFormatter';
import getCountryCode from '@eubfr/lib/getCountryCode';
import type { Project } from '@eubfr/types';

/**
 * Preprocess `budget` field.
 *
 * Input fields taken from the `record` are:
 *
 * - `_eu_funding`
 *
 * @memberof EuInvestCSVTransform
 * @param {Object} record The row received from parsed file
 * @returns {Budget}
 */
const getBudget = record => {
  const budget = {
    total_cost: sanitizeBudgetItem(),
    private_fund: sanitizeBudgetItem(),
    public_fund: sanitizeBudgetItem(),
    other_contrib: sanitizeBudgetItem(),
    eu_contrib: sanitizeBudgetItem(),
    funding_area: [],
    mmf_heading: '',
  };

  if (record._eu_funding) {
    budget.eu_contrib = sanitizeBudgetItem({
      value: record._eu_funding,
      currency: 'EUR',
      raw: record._eu_funding,
    });
  }

  return budget;
};

/**
 * Preprocess `description` field.
 *
 * Input fields taken from the `record` are:
 *
 * - `_about_this_project`
 * - `_background_info`
 *
 * @memberof EuInvestCSVTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getDescription = record => {
  const about = record._about_this_project || '';
  const background = record._background_info || '';

  if (about && !background) return about;

  if (!about && background) return background;

  if (about && background) {
    return `${about}\n${background}`.trim();
  }

  // If there is neither an about, nor background information.
  return '';
};

/**
 * Preprocess `media` field.
 *
 * Input fields taken from the `record` are:
 *
 * - `_banner`
 * - `_banner_copy`
 * - `_visual`
 * - `_images_copyright`
 *
 * @memberof EuInvestCSVTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<Media>}
 */
const getMedia = record => {
  const media = [];

  if (record._banner) {
    media.push({
      name: record._banner,
      url: record._banner,
      meta: {
        description: record._banner_copy || '',
        mime_type: '',
        type: 'visual',
      },
    });
  }

  if (record._visual) {
    media.push({
      name: record._visual,
      url: record._visual,
      meta: {
        description: record._images_copyright || '',
        mime_type: '',
        type: 'visual',
      },
    });
  }

  return media;
};

/**
 * Preprocess `project_id` field.
 *
 * Input fields taken from the `record` are:
 *
 * - `_nid`
 *
 * @memberof EuInvestCSVTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getId = record => record._nid || '';

/**
 * Preprocess `locations` field.
 *
 * Input fields taken from the `record` are:
 *
 * - `_location`_location
 *
 * @memberof EuInvestCSVTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<Location>}
 */
const getLocations = record => {
  const locations = [];

  if (record._location) {
    const locationItems = record._location
      .split(';')
      .map(p => p.trim())
      .filter(l => l);

    locationItems.forEach(item => {
      const [region, code] = item.split(',').map(a => a.trim());

      locations.push({
        centroid: null,
        address: '',
        country_code: getCountryCode(code),
        location: null,
        nuts: [],
        postal_code: '',
        region,
        town: '',
      });
    });
  }

  return locations;
};

/**
 * Preprocess `related_links` field.
 *
 * Input fields taken from the `record` are:
 *
 * - `_external_links`
 *
 * @memberof EuInvestCSVTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<RelatedLink>}
 */
const getLinks = record =>
  record._external_links
    .split(';')
    .map(l => l.trim())
    .filter(l => l)
    .map(url => ({ url, label: '' }));

/**
 * Preprocess `themes` field.
 *
 * Input fields taken from the `record` are:
 *
 * - `_sector`
 *
 * @memberof EuInvestCSVTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array}
 */
const getThemes = record =>
  record._sector
    .split(';')
    .map(t => t.trim())
    .filter(t => t);

/**
 * Preprocess `third_parties` field.
 *
 * Input fields taken from the `record` are:
 *
 * - `_coordinator`
 * - `_partners`
 *
 * @memberof EuInvestCSVTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<ThirdParty>}
 */
const getThirdParties = record => {
  const thirdParties = [];

  if (record._coordinator) {
    thirdParties.push({
      name: record._coordinator.trim(),
      type: '',
      address: '',
      region: '',
      role: 'coordinator',
      country: '',
      website: '',
      phone: '',
      email: '',
    });
  }

  if (record._partners) {
    const partners = record._partners
      .split(',')
      .map(p => p.trim())
      .filter(p => p)
      .map(name => ({
        name,
        type: '',
        address: '',
        region: '',
        role: 'partner',
        country: '',
        website: '',
        phone: '',
        email: '',
      }));

    thirdParties.push(...partners);
  }

  return thirdParties;
};

/**
 * Format date
 *
 * @memberof EuInvestCSVTransform
 * @param {Date} date Date in DD/MM/YYYY format
 * @returns {Date} The date formatted into an ISO 8601 date format
 *
 * @example
 * input => "01/01/2009"
 * output => "2009-01-01T00:00:00.000Z"
 */
const formatDate = date => {
  if (!date || typeof date !== 'string') return null;
  const d = date.split(/\//);
  if (d.length !== 3) return null;
  const [day, month, year] = d;
  if (!day || !month || !year) return null;
  try {
    return new Date(Date.UTC(year, month - 1, day)).toISOString();
  } catch (e) {
    return null;
  }
};

/**
 * Preprocess `timeframe` field.
 *
 * Input fields taken from the `record` are:
 *
 * - `Timeframe`
 *
 * @memberof EuInvestCSVTransform
 * @param {Object} record The row received from parsed file
 * @returns {Timeframe}
 */
const getTimeframe = record => {
  const timeframe = {
    from: '',
    from_precision: 'day',
    to: '',
    to_precision: 'day',
  };

  if (record._timeframe) {
    const tParts = record._timeframe.split('to').map(t => t.trim());
    const [from, to] = tParts;

    const fromDate = formatDate(from);
    const toDate = formatDate(to);

    timeframe.from = fromDate || '';
    timeframe.to = toDate || '';
  }

  return timeframe;
};

/**
 * Preprocess `title` field.
 *
 * Input fields taken from the `record` are:
 *
 * - `_title`
 * - `_subtitle`
 *
 * @memberof EuInvestCSVTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getTitle = record => {
  let title = '';

  if (record._title) {
    title = record._title;
  }

  if (record._subtitle) {
    title = `${title} | ${record._subtitle}`;
  }

  return title;
};

/**
 * Map fields for EUINVEST producer, CSV file types
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/euinvest/csv/test/stubs/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/euinvest/csv/src/lib/transform.js|implementation details}
 * @name EuInvestCSVTransform
 * @param {Object} record Piece of data to transform before going to harmonized storage.
 * @returns {Project} JSON matching the type fields.
 */
export default (record: Object): Project | null => {
  if (!record) return null;

  return {
    action: '',
    budget: getBudget(record),
    call_year: '',
    description: getDescription(record),
    ec_priorities: [],
    media: getMedia(record),
    programme_name: '',
    project_id: getId(record),
    project_locations: getLocations(record),
    project_website: '',
    complete: true,
    related_links: getLinks(record),
    reporting_organisation: '',
    results: {
      available: '',
      result: '',
    },
    status: '',
    sub_programme_name: '',
    success_story: '',
    themes: getThemes(record),
    third_parties: getThirdParties(record),
    timeframe: getTimeframe(record),
    title: getTitle(record),
    type: [],
  };
};
