// @flow

import type { Project } from '../../../../types/Project';

/*
 * Transform message (INFOREGIO XML)
 */

// Check if field is an array or a sting.
const checkData = data => {
  if (data && typeof data === 'object') {
    return data[0];
  } else if (data && typeof data === 'string') {
    return data;
  }
  return '';
};

// Formats date from DD/MM/YYYY to ISO 8601 date format.
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

// Get and format adress from different fields.
const getAddress = record => {
  let address = '';
  if (record.Beneficiary_address) {
    address += checkData(record.Beneficiary_address);
  }
  if (record.Beneficiary_Post_Code) {
    if (address !== '') address += ', ';
    address += checkData(record.Beneficiary_Post_Code);
  }
  if (record.Beneficiary_City) {
    if (address !== '') address += ', ';
    address += checkData(record.Beneficiary_City);
  }
  return address;
};

const formatBudget = budget => {
  if (!budget || typeof budget !== 'string') return 0;
  const formattedBudget = budget
    .split(' ')
    .slice(1)
    .join('');
  return Number(formattedBudget) || 0;
};

/*
 * Map fields
 */
export default (record: Object): Project => {
  // Preprocess budget
  const budgetObject = {
    total_cost: {
      value: formatBudget(checkData(record.Total_project_budget)),
      currency: '',
      raw: checkData(record.Total_project_budget) || '',
    },
    eu_contrib: {
      value: formatBudget(checkData(record.EU_Budget_contribution)),
      currency: '',
      raw: checkData(record.EU_Budget_contribution) || '',
    },
    private_fund: { value: 0, currency: '', raw: '' },
    public_fund: { value: 0, currency: '', raw: '' },
    other_contrib: { value: 0, currency: '', raw: '' },
    // Check data and return an array or a string.
    funding_area: checkData(record.Funds)
      // Make an array of strings if multiple items in the field.
      .split(';')
      // Remove empty strings.
      .filter(item => item),
    mmf_heading: '',
  };

  // Preprocess project locations
  const locationArray = [];
  const countryArray = record.Project_country
    ? checkData(record.Project_country)
        .toString()
        .split('; ')
        .filter(country => country)
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
          centroid: null,
        });
        previousCountries.push(countryArray[i]);
      }
    }
  } else {
    locationArray.push({
      country_code: checkData(record.Project_country),
      region: checkData(record.Project_region),
      nuts2: checkData(record.Project_NUTS2_code),
      address: '',
      postal_code: '',
      town: '',
      location: null,
      centroid: null,
    });
  }

  // Preprocess type
  const typeArray = record.Project_type || [];

  // Preprocess themes
  const themeArray = record.Themes
    ? checkData(record.Themes)
        .toString()
        .split('; ')
        .filter(theme => theme)
    : [];

  // Preprocess partners
  const partnerArray = record.Beneficiary
    ? [
        {
          name: checkData(record.Beneficiary),
          type: '',
          address: getAddress(record),
          region: '',
          country: checkData(record.Beneficiary_Country),
          website: '',
        },
      ]
    : [];

  // Map the fields
  return {
    action: '',
    budget: budgetObject,
    call_year: '',
    coordinators: [],
    description: checkData(record.quote),
    ec_priorities: [],
    media: {
      cover_image: '',
      video: '',
    },
    partners: partnerArray,
    period: checkData(record.Period),
    programme_name: '',
    project_id: checkData(record.PROJECTID).toString(),
    project_locations: locationArray,
    project_website: checkData(record.URL),
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
      from: formatDate(checkData(record.Project_Timeframe_start_date)),
      to: formatDate(checkData(record.Project_Timeframe_end_date)),
    },
    title: checkData(record.Project_name),
    type: typeArray,
  };
};
