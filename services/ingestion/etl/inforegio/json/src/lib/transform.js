// @flow

import type { Project } from '../../../../types/Project';

/*
 * Transform message (REGIO JSON)
 */

// Formats date from DD/MM/YYYY to ISO 8601 date format.
const formatDate = date => {
  if (!date) return '';
  const d = date.split(/\//);
  if (d === null || d.length !== 3) return '';
  if (d[2].length === 2) d[2] = `20${d[2]}`;
  return new Date(d[2], d[1] - 1, d[0]).toISOString();
};

const getAddress = record => {
  let address = '';
  if (record.Beneficiary_address) {
    address += record.Beneficiary_address;
  }
  if (record.Beneficiary_Post_Code) {
    if (address !== '') address += ', ';
    address += record.Beneficiary_Post_Code;
  }
  if (record.Beneficiary_City) {
    if (address !== '') address += ', ';
    address += record.Beneficiary_City;
  }
  return address;
};

const getProjectWebsite = record => {
  if (record.URL && typeof record.URL === 'object') {
    return record.URL[0];
  } else if (record.URL && typeof record.URL === 'string') {
    return record.URL;
  }
  return '';
};

const formatBudget = budget => {
  if (!budget) return 0;
  const b = budget.split(' ');

  if (b === null || b.length < 2) return 0;

  let s = '';
  for (let i = 1; i < b.length; i += 1) {
    s += b[i];
  }
  return Number(s);
};

/*
 * Map fields
 */
export default (record: Object): Project => {
  // Preprocess budget
  const budgetObject = {
    total_cost: formatBudget(record.Total_project_budget),
    eu_contrib: formatBudget(record.EU_Budget_contribution),
    private_fund: 0,
    public_fund: 0,
    other_contrib: 0,
    funding_area: record.Funds || null,
  };

  // Preprocess project locations
  const locationArray = [];
  const countryArray = record.Project_country
    ? record.Project_country.split('; ')
    : null;
  const previousCountries = [];
  if (countryArray !== null && countryArray.length > 1) {
    for (let i = 0; i < countryArray.length; i += 1) {
      if (previousCountries.indexOf(countryArray[i] === -1)) {
        locationArray.push({
          country_code: countryArray[i],
          region: '',
          nuts2: '',
          address: '',
          postal_code: '',
          town: '',
          location: null,
        });
        previousCountries.push(countryArray[i]);
      }
    }
  } else {
    locationArray.push({
      country_code: record.Project_country,
      region: record.Project_region,
      nuts2: record.Project_NUTS2_code,
      address: '',
      postal_code: '',
      town: '',
      location: null,
    });
  }

  // Preprocess type
  const typeArray = [record.Project_type];

  // Preprocess themes
  const themeArray = record.Thèmes ? record.Thèmes.split('; ') : null;

  // Preprocess partners
  const partnerArray = [
    {
      name: record.Beneficiary,
      type: '',
      address: getAddress(record),
      region: '',
      country: record.Beneficiary_Country,
      website: '',
    },
  ];

  // Map the fields
  return {
    project_id: record.PROJECTID.toString(),
    type: typeArray,
    period: record.Period,
    title: record.Project_name,
    project_locations: locationArray,
    themes: themeArray,
    budget: budgetObject,
    description: record.quote,
    project_website: getProjectWebsite(record),
    partners: partnerArray,
    timeframe: {
      from: formatDate(record.Project_Timeframe_start_date),
      to: formatDate(record.Project_Timeframe_end_date),
    },
    programme_name: '',
    ec_priorities: [],
    cover_image: '',
    coordinators: [],
  };
};
