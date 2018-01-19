// @flow

import type { Project } from '../../../../types/Project';

/*
 * Transform message (REGIO JSON)
 */

const getFundingArea = record =>
  // Get value for 'Funding area' if property is present.
  (record.Funds ? record.Funds.split(';') : []).filter(
    // Remove empty strings.
    item => item
  );

// Formats date from DD/MM/YYYY to ISO 8601 date format.
const formatDate = date => {
  if (!date) return null;
  const d = date.split(/\//);
  if (d === null || d.length !== 3) return null;
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
    total_cost: {
      value: formatBudget(record.Total_project_budget),
      currency: '',
      raw: record.Total_project_budget || '',
    },
    eu_contrib: {
      value: formatBudget(record.EU_Budget_contribution),
      currency: '',
      raw: record.EU_Budget_contribution || '',
    },
    private_fund: { value: 0, currency: '', raw: '' },
    public_fund: { value: 0, currency: '', raw: '' },
    other_contrib: { value: 0, currency: '', raw: '' },
    funding_area: getFundingArea(record),
  };

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

  // Preprocess themes
  const themeArray = record.Thèmes ? record.Thèmes.split('; ') : [];

  // Preprocess type
  const typeArray = [record.Project_type];

  // Map the fields
  return {
    action: '',
    budget: budgetObject,
    call_year: '',
    coordinators: [],
    description: record.quote,
    ec_priorities: [],
    media: {
      cover_image: '',
      video: '',
    },
    partners: partnerArray,
    period: record.Period,
    programme_name: '',
    project_id: record.PROJECTID.toString(),
    project_locations: locationArray,
    project_website: getProjectWebsite(record),
    related_links: [],
    results: {
      available: '',
      result: '',
    },
    status: '',
    sub_programme_name: '',
    success_story: '',
    themes: themeArray,
    timeframe: {
      from: formatDate(record.Project_Timeframe_start_date),
      to: formatDate(record.Project_Timeframe_end_date),
    },
    title: record.Project_name,
    type: typeArray,
  };
};
