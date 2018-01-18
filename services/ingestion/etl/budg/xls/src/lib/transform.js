// @flow

import type { Project } from '../../../../types/Project';

/*
 * Transform message (BUDG XLS)
 */

const formatDate = date => {
  if (!date) return null;
  const d = date.split(/\//);
  if (d === null || d.length !== 3) return null;
  if (d[2].length === 2) d[2] = `20${d[2]}`;
  const day = d[1];
  const month = d[0];
  const year = d[2];
  return new Date(Date.UTC(year, month - 1, day)).toISOString();
};

/*
 * Map fields
 */
export default (record: Object): Project => {
  // Preprocess budget
  const budgetObject = {
    total_cost: { value: 0, currency: '', raw: '' },
    eu_contrib: {
      value: Number(
        record[
          "EU Grant award in euros (This amount represents the grant awarded after the selection stage and is indicative. Please note that any changes made during or after the project's lifetime will not be reflected here.)"
        ].replace(/,/g, '')
      ),
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
  };

  // Preprocess coordinators
  const coordArray = [
    {
      name: record["Coordinator's name"],
      type: record['Coordinator organisation type'],
      address: record["Coordinator's address"],
      region: record["Coordinator's region"],
      country: record["Coordinator's country"],
      website: record["Coordinator's website"],
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
  for (let i = 0; i < partnerKeys.length; i += 1) {
    if (record[`Partner ${i + 1} name`]) {
      partnerArray.push({
        name: record[`Partner ${i + 1} name`],
        type: record[`Partner ${i + 1} organisation type`],
        address: record[`Partner ${i + 1} address`],
        region: record[`Partner ${i + 1} region`],
        country: record[`Partner ${i + 1} country`],
        website: record[`Partner ${i + 1} website`],
      });
    }
  }

  // Preprocess locations
  const locationArray = record['Participating countries']
    .split(',')
    .map(country => ({
      country_code: country,
      region: '',
      nuts2: '',
      address: '',
      postal_code: '',
      town: '',
      location: null,
    }));

  // Preprocess results
  const resultObject = {
    available: record['Results Available'],
    result: record['Results Platform Project Card'],
  };

  // Preprocess type
  const typeArray =
    (record['Activity type'] != null && record['Activity type'].split(',')) ||
    [];

  // Map the fields
  return {
    action: record.Action,
    budget: budgetObject,
    call_year: record['Call year'],
    coordinators: coordArray,
    cover_image: '',
    description: record['Project Summary'],
    ec_priorities: [],
    partners: partnerArray,
    programme_name: record.Programme,
    project_id: record['Project Number'],
    project_locations: locationArray,
    project_website: record['Project Website'],
    related_links: [],
    results: resultObject,
    status: record['Project Status'],
    sub_programme_name: record['Sub-programme'],
    success_story: record['Is Success Story'],
    themes: [],
    timeframe: {
      from: formatDate(record['Start date']),
      to: formatDate(record['End date']),
    },
    title: record['Project Title'],
    type: typeArray,
  };
};
