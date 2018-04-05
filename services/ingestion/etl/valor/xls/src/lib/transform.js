// @flow

import type { Project } from '../../../../_types/Project';

/*
 * Transform message (VALOR XLS)
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
    total_cost: { value: 0, currency: '', raw: '' },
    eu_contrib: {
      value:
        Number(
          record[
            "EU Grant award in euros (This amount represents the grant awarded after the selection stage and is indicative. Please note that any changes made during or after the project's lifetime will not be reflected here.)"
          ].replace(/,/g, '')
        ) || 0,
      currency: 'EUR',
      raw:
        record[
          "EU Grant award in euros (This amount represents the grant awarded after the selection stage and is indicative. Please note that any changes made during or after the project's lifetime will not be reflected here.)"
        ] || '',
    },
    private_fund: { value: 0, currency: '', raw: '' },
    public_fund: { value: 0, currency: '', raw: '' },
    other_contrib: { value: 0, currency: '', raw: '' },
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
      country_code: country,
      region: '',
      nuts: [],
      address: '',
      postal_code: '',
      town: '',
      centroid: null,
      location: null,
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
    media: {
      cover_image: '',
      video: '',
    },
    programme_name: record.Programme,
    project_id: record['Project Identifier'] || '',
    project_locations: locationArray,
    project_website: record['Project Website'] || '',
    related_links: [],
    results: resultObject,
    status: record['Project Status'] || '',
    sub_programme_name: record['Sub-programme'] || '',
    success_story: record['Is Success Story'] || '',
    themes: [],
    third_parties: thirdPartiesArray || [],
    timeframe: {
      from: formatDate(record['Start date']),
      to: formatDate(record['End date']),
    },
    title: record['Project Title'] || '',
    type: typeArray,
  };
};
