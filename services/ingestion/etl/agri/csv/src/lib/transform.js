// @flow

/*
 * Transform message (AGRI CSV)
 */

import type { Project } from '../../../../types/Project';

/**
 * Converts a single string to an array of multiple values.
 * @memberof transformAgriCsv
 * @param {Object} record The row received from harmonized storage.
 * @returns {Array} List of string values for `funding_area` field.
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
 * @memberof transformAgriCsv
 * @param {Object} record The row received from harmonized storage.
 * @returns {Array} List of {Coordinator} objects for `coordinators` field.
 * @example
 * input => "Eva Maria Plunger (VERBUND AG); foo; bar"
 * output => ["Eva Maria Plunger (VERBUND AG)", "foo", "bar"]
 */
const getCoordinators = record =>
  record.Coordinators.split(';').map(coordinator => ({
    name: coordinator,
    type: '',
    address: '',
    region: '',
    country: '',
    website: '',
    phone: '',
    email: '',
  }));

/**
 * Preprocess partners
 * @memberof transformAgriCsv
 * @param {Object} record The row received from harmonized storage.
 * @returns {Array} List of {Partner} objects for `partners` field.
 * @example
 * input => "foo, bar, baz"
 * output => ["foo", "bar", "baz"]
 */
const getPatners = record =>
  record.Partners.split(',').map(partner => ({
    name: partner,
    type: '',
    address: '',
    region: '',
    country: '',
    website: '',
  }));

/**
 * Map fields for AGRI producer, CSV file types.
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/agri/csv/test/stubs/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/agri/csv/src/lib/transform.js|implementation details}
 * @name transformAgriCsv
 * @param {Object} record The row received from harmonized storage.
 * @returns {Project} JSON matching the type fields.
 */
export default (record: Object): Project => {
  const budgetObject = {
    total_cost: 0,
    eu_contrib: Number(record['EU Budget contribution']),
    private_fund: 0,
    public_fund: 0,
    other_contrib: 0,
    funding_area: getFundingArea(record),
  };

  // Preprocess coordinators
  const coordArray = getCoordinators(record);

  // Preprocess partners
  const partnerArray = getPatners(record);

  // Preprocess locations
  const longArray = record['Project location longitude'].split(';');
  const latArray = record['Project location latitude'].split(';');
  const locationArray = record['Project country(ies)']
    .split(';')
    .map((country, index) => ({
      country_code: country,
      region: '',
      nuts2: '',
      address: record['Project address(es)'] || '',
      postal_code: record['Project postal code(s)'] || '',
      town: record['Project town(s)'] || '',
      location: {
        type: 'Point',
        coordinates: [
          parseFloat(Array.isArray(longArray) && longArray[index]) || 0,
          parseFloat(Array.isArray(latArray) && latArray[index]) || 0,
        ],
      },
    }));

  // Preprocess related links
  const links = (record['Related links'] || '')
    .split(';')
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
    coordinators: coordArray,
    cover_image: record.Visual || '',
    description: record['Project description'] || '',
    ec_priorities: record['EC’s priorities'].split(';') || [],
    partners: partnerArray,
    programme_name: record['Programme name'] || '',
    project_id: record.Nid || '',
    project_locations: locationArray,
    project_website: record['Project webpage'] || '',
    related_links: links,
    results: resultObject,
    status: '',
    sub_programme_name: '',
    success_story: '',
    themes: [],
    timeframe: {
      from:
        timeframeFrom &&
        new Date(parseInt(timeframeFrom, 10) * 1000).toISOString(),
      to:
        timeframeTo && new Date(parseInt(timeframeTo, 10) * 1000).toISOString(),
    },
    title: record.Name || '',
    type: [],
  };
};
