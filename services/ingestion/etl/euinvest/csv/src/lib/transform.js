// @flow

import sanitizeBudgetItem from '@eubfr/lib/budget/budgetFormatter';
import getCountryCode from '@eubfr/lib/getCountryCode';
import type { Project } from '@eubfr/types';

/**
 * Preprocess `budget` field.
 *
 * Input fields taken from the `record` are:
 *
 * - `EU Funding`
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

  if (record['EU Funding']) {
    budget.eu_contrib = sanitizeBudgetItem({
      value: record['EU Funding'],
      currency: 'EUR',
      raw: record['EU Funding'],
    });
  } else {
    budget.eu_contrib = sanitizeBudgetItem();
  }

  return budget;
};

/**
 * Preprocess `description` field.
 *
 * Input fields taken from the `record` are:
 *
 * - `About this project`
 * - `Background information`
 *
 * @memberof EuInvestCSVTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getDescription = record => {
  const about = record['About this project'] || '';
  const background = record['Background information'] || '';

  if (about && !background) return about;

  if (!about && background) return background;

  if (about && background) {
    return (about + '\n' + background).trim();
  }

  // If there is neither an about, nor background information.
  return '';
};

/**
 * Preprocess `media` field.
 *
 * Input fields taken from the `record` are:
 *
 * - `Banner`
 * - `Banner copy`
 * - `Visual`
 * - `© Images`
 *
 * @memberof EuInvestCSVTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<Media>}
 */
const getMedia = record => {
  const media = [];

  if (record.Banner) {
    media.push({
      name: record.Banner,
      url: record.Banner,
      meta: {
        description: record['Banner copy'] || '',
        mime_type: '',
        type: 'visual',
      },
    });
  }

  if (record.Visual) {
    media.push({
      name: record.Visual,
      url: record.Visual,
      meta: {
        description: record['© Images'] || '',
        mime_type: '',
        type: 'visual',
      },
    });
  }

  return media;
};

/**
 * Preprocess `locations` field.
 *
 * Input fields taken from the `record` are:
 *
 * - `Project location`
 *
 * @memberof EuInvestCSVTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<Location>}
 */
const getLocations = record => {
  const locations = [];

  if (record['Project location']) {
    const locParts = record['Project location']
      .split(',')
      .map(p => p.trim())
      .filter(l => l);

    locations.push({
      centroid: null,
      address: '',
      country_code: getCountryCode(locParts[1]),
      location: null,
      nuts: [],
      postal_code: '',
      region: locParts[0],
      town: '',
    });
  }

  return locations;
};

/**
 * Preprocess `related_links` field.
 *
 * Input fields taken from the `record` are:
 *
 * - `External links`
 *
 * @memberof EuInvestCSVTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<RelatedLink>}
 */
const getLinks = record =>
  record['External links']
    .split(',')
    .map(l => l.trim())
    .filter(l => l)
    .map(url => ({ url, label: '' }));

/**
 * Preprocess `themes` field.
 *
 * Input fields taken from the `record` are:
 *
 * - `Sector`
 *
 * @memberof EuInvestCSVTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array}
 */
const getThemes = record =>
  record['Sector']
    .split(',')
    .map(t => t.trim())
    .filter(t => t);

/**
 * Preprocess `third_parties` field.
 *
 * Input fields taken from the `record` are:
 *
 * - `Coordinator`
 * - `Partners`
 *
 * @memberof EuInvestCSVTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<ThirdParty>}
 */
const getThirdParties = record => {
  const thirdParties = [];

  if (record.Coordinator) {
    thirdParties.push({
      name: record.Coordinator.trim(),
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

  if (record.Partners) {
    const partners = record.Partners.split(',')
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

  if (record.Timeframe) {
    const tParts = record.Timeframe.split('to').map(t => t.trim());
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
 * - `Title`
 *
 * @memberof EuInvestCSVTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getTitle = record => record.Title || '';

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
    project_id: '',
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
