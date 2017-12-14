// @flow

/*
 * Transform message (BUDG CSV)
 */

import type { Project } from '../../../../types/Project';

/*
 * Map fields
 */
export default (record: Object): Project => {
  // Preprocess budget
  const budgetObject = {
    total_cost: null,
    eu_contrib: Number(record['EU Budget contribution']),
    private_fund: null,
    public_fund: null,
    other_contrib: null,
    funding_area: null,
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

      return null;
    })
    .filter(link => link !== null);

  // Preprocess project locations
  const latArray = record['Project location latitude'].split(';');
  const longArray = record['Project location longitude'].split(';');
  const locationArray = record['Project country(ies)']
    .split(';')
    .map((country, index) => ({
      country_code: country,
      region: null,
      nuts2: null,
      address: record['Project address(es)'],
      postal_code: record['Project postal code(s)'],
      town: record['Project town(s)'],
      location: {
        // elasticsearch specific structure for geo_point
        // read more https://www.elastic.co/guide/en/elasticsearch/reference/5.5/modules-scripting-expression.html#_literal_geo_point_literal_field_api
        lat: (Array.isArray(latArray) && latArray[index]) || 0,
        lon: (Array.isArray(longArray) && longArray[index]) || 0,
      },
    }));

  // Preprocess coordinators
  const coordArray = record.Coordinators.split(';').map(coordinator => ({
    name: coordinator,
    type: null,
    address: null,
    region: null,
    country: null,
    website: null,
    phone: null,
    email: null,
  }));

  // Preprocess partners
  const partnerArray = record.Partners.split(',').map(partner => ({
    name: partner,
    type: null,
    address: null,
    region: null,
    country: null,
    website: null,
  }));

  // Preprocess results
  const resultObject = {
    available: null,
    result: record.Results,
  };

  // Map the fields
  return {
    project_id: record.Nid,
    title: record.Name,
    cover_image: record.Visual,
    programme_name: record['Programme name'],
    description: record['Project description'],
    results: resultObject,
    ec_priorities: record['EC’s priorities'].split(';'),
    coordinators: coordArray,
    budget: budgetObject,
    partners: partnerArray,
    project_locations: locationArray,
    timeframe: {
      from:
        timeframeFrom &&
        new Date(parseInt(timeframeFrom, 10) * 1000).toISOString(),
      to:
        timeframeTo && new Date(parseInt(timeframeTo, 10) * 1000).toISOString(),
    },
    project_website: record['Project webpage'],
    related_links: links,
  };
};
