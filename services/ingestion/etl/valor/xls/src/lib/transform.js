// @flow

import sanitizeBudgetItem from '@eubfr/lib/budgetFormatter';
import getCountryCode from '@eubfr/lib/getCountryCode';
import type { Project } from '@eubfr/types';

/*
 * Transform message (VALOR XLS)
 */

/**
 * Format date
 *
 * @memberof valorXlsTransform
 * @param {Date} date Date in "10/9/14" (MM/DD/YY) or "10/9/2014" (MM/DD/YYYY) format
 * @returns {Date} The date formatted into an ISO 8601 date format
 *
 * @example
 * input => "10/9/2014"
 * output => "2014-10-09T00:00:00.000Z"
 */
const formatDate = date => {
  if (!date || typeof date !== 'string') return null;
  const d = date.split(/\//);
  if (d.length !== 3) return null;
  // If year is given as 2 digits, make it 4 digits.
  if (d[2].length === 2) d[2] = `20${d[2]}`;
  const [month, day, year] = d;
  if (!day || !month || !year) return null;
  try {
    return new Date(Date.UTC(year, month - 1, day)).toISOString();
  } catch (e) {
    return null;
  }
};

/**
 * Map fields for VALOR producer, XLS file types.
 *
 * Mapping document: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/valor/xml/mapping.md|markdown version}
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/valor/xml/src/lib/transform.js|implementation details}
 * @name valorXlsTransform
 * @param {Object} record Piece of data to transform before going to harmonized storage.
 * @returns {Project} JSON matching the type fields.
 */
export default (record: Object): Project => {
  // Preprocess budget
  const budgetObject = {
    total_cost: sanitizeBudgetItem(),
    eu_contrib: sanitizeBudgetItem({
      value: record[
        "EU Grant award in euros (This amount represents the grant awarded after the selection stage and is indicative. Please note that any changes made during or after the project's lifetime will not be reflected here.)"
      ].replace(/,/g, ''),
      currency: 'EUR',
      raw:
        record[
          "EU Grant award in euros (This amount represents the grant awarded after the selection stage and is indicative. Please note that any changes made during or after the project's lifetime will not be reflected here.)"
        ],
    }),
    private_fund: sanitizeBudgetItem(),
    public_fund: sanitizeBudgetItem(),
    other_contrib: sanitizeBudgetItem(),
    funding_area: [],
    mmf_heading: '',
  };

  // Preprocess coordinators
  const coordArray = [
    {
      name: record['Coordinating organisation name'] || '',
      type: record['Coordinating organisation type'] || '',
      address: record["Coordinator's address"] || '',
      region: record["Coordinator's region"] || '',
      role: 'coordinator',
      country: record["Coordinator's country"] || '',
      website: record["Coordinator's website"] || '',
      phone: '',
      email: '',
    },
  ];

  // Preprocess partners
  const recordKeys = Object.keys(record);
  const partnerKeys = recordKeys.filter(elem => {
    const re = new RegExp('Partner ' + '([0-9]{1,2})' + ' name', 'g'); // eslint-disable-line
    return elem.match(re);
  });

  const partnerArray = [];
  for (let i = 1; i <= partnerKeys.length; i += 1) {
    if (record[`Partner ${i} name`]) {
      partnerArray.push({
        name: record[`Partner ${i} name`] || '',
        type: record[`Partner ${i} organisation type`] || '',
        address: record[`Partner ${i} address`] || '',
        region: record[`Partner ${i} region`] || '',
        role: 'partner',
        country: record[`Partner ${i} country`] || '',
        website: record[`Partner ${i} website`] || '',
        phone: '',
        email: '',
      });
    }
  }

  // Preprocess locations
  const locationArray = record['Participating countries']
    .split(',')
    .filter(loc => loc)
    .map(country => ({
      address: '',
      centroid: null,
      country_code: getCountryCode(country),
      location: null,
      nuts: [],
      postal_code: '',
      region: '',
      town: '',
    }));

  // Preprocess results
  const resultObject = {
    available: record['Results Available'] || '',
    result: record['Results Platform Project Card'] || '',
  };

  // Preprocess type
  const typeArray =
    (record['Activity type'] != null && record['Activity type'].split(',')) ||
    [];

  // Preprocess third parties
  const thirdPartiesArray = coordArray.concat(partnerArray);

  // Map the fields
  return {
    action: record.Action,
    budget: budgetObject,
    call_year: record['Call year'] || '',
    description: record['Project Summary'] || '',
    ec_priorities: [],
    media: [],
    programme_name: record.Programme,
    project_id: record['Project Identifier'] || '',
    project_locations: locationArray,
    project_website: record['Project Website'] || '',
    related_links: [],
    reporting_organisation: ['EAC'],
    results: resultObject,
    status: record['Project Status'] || '',
    sub_programme_name: record['Sub-programme'] || '',
    success_story: record['Is Success Story'] || '',
    themes: [],
    third_parties: thirdPartiesArray || [],
    timeframe: {
      from: formatDate(record['Start date']),
      from_precision: 'day',
      to: formatDate(record['End date']),
      to_precision: 'day',
    },
    title: record['Project Title'] || '',
    type: typeArray,
  };
};
