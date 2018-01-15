// @flow

import type { Project } from '../../../../types/Project';

/*
 * Transform message (BUDG XLS)
 */

/*
 * Map fields
 */
export default (record: Object): Project => {
  // Preprocess budget
  const budgetObject = {
    total_cost: 0,
    eu_contrib: Number(
      record[
        "EU Grant award in euros (This amount represents the grant awarded after the selection stage and is indicative. Please note that any changes made during or after the project's lifetime will not be reflected here.)"
      ].replace(/,/g, '')
    ),
    private_fund: 0,
    public_fund: 0,
    other_contrib: 0,
    funding_area: '',
    total_cost_raw: '',
    eu_contrib_raw:
      record[
        "EU Grant award in euros (This amount represents the grant awarded after the selection stage and is indicative. Please note that any changes made during or after the project's lifetime will not be reflected here.)"
      ] || '',
    currency: 'EUR',
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
    if (record[`Partner ${i + 1} name`] != null) {
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

  // Preprocess timeframe
  const timeframeFrom = record['Start date']
    ? new Date(record['Start date']).toISOString()
    : null;
  const timeframeTo = record['End date']
    ? new Date(record['End date']).toISOString()
    : null;

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
      from: timeframeFrom,
      to: timeframeTo,
    },
    title: record['Project Title'],
    type: typeArray,
  };
};
