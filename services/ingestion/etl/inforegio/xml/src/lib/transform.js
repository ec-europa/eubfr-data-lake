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
  if (!date) return null;
  const d = date.toString().split(/\//);
  if (d === null || d.length !== 3) return null;
  if (d[2].length === 2) d[2] = `20${d[2]}`;
  return new Date(d[2], d[1] - 1, d[0]).toISOString();
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
  if (!budget) return 0;
  budget
    .toString()
    .split(' ')
    .slice(1)
    .join('');
  return Number(budget);
};

/*
 * Map fields
 */
export default record => {
  // Preprocess budget
  const budgetObject = {
    total_cost: formatBudget(checkData(record.Total_project_budget)),
    eu_contrib: formatBudget(checkData(record.EU_Budget_contribution)),
    private_fund: null,
    public_fund: null,
    other_contrib: null,
    funding_area: checkData(record.Funds) || null,
  };

  // Preprocess project locations
  const locationArray = [];
  const countryArray = record.Project_country
    ? checkData(record.Project_country)
        .toString()
        .split('; ')
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
      country_code: checkData(record.Project_country),
      region: checkData(record.Project_region),
      nuts2: checkData(record.Project_NUTS2_code),
      address: '',
      postal_code: '',
      town: '',
      location: null,
    });
  }

  // Preprocess type
  const typeArray = record.Project_type || null;

  // Preprocess themes
  const themeArray = record.Themes
    ? checkData(record.Themes)
        .toString()
        .split('; ')
    : null;

  // Preprocess partners
  const partnerArray = record.Beneficiary
    ? [
        {
          name: checkData(record.Beneficiary),
          type: null,
          address: getAddress(record),
          region: null,
          country: checkData(record.Beneficiary_Country),
          website: null,
        },
      ]
    : null;

  // Map the fields
  return {
    project_id: checkData(record.PROJECTID).toString(),
    title: checkData(record.Project_name),
    type: typeArray,
    period: checkData(record.Period),
    project_locations: locationArray,
    themes: themeArray,
    budget: budgetObject,
    description: checkData(record.quote),
    project_website: checkData(record.URL),
    partners: partnerArray,
    timeframe: {
      from: formatDate(checkData(record.Project_Timeframe_start_date)),
      to: formatDate(checkData(record.Project_Timeframe_end_date)),
    },
  };
};
