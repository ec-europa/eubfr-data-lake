/*
 * Transform message (REGIO JSON)
 */

// Formats date from DD/MM/YYYY to ISO 8601 date format.
const formatDate = date => {
  if (!date) return null;
  const d = date.split(/\//);
  if (d.length !== 3) return null;
  if (d[2].length === 2) d[2] = `20${d[2]}`;
  return new Date(d[2], d[1] - 1, d[0]).toISOString();
};

const getAddress = record => {
  let address = '';
  if (record['beneficiary address']) {
    address += record['beneficiary address'];
  }
  if (record['beneficiary post code']) {
    if (address !== '') address += ', ';
    address += record['beneficiary post code'];
  }
  if (record['beneficiary city']) {
    if (address !== '') address += ', ';
    address += record['beneficiary city'];
  }
  return address;
};

const getProjectWebsite = record => {
  if (record.url && typeof record.url === 'object') {
    return record.url[0];
  } else if (record.url && typeof record.url === 'string') {
    return record.url;
  }
  return '';
};

const formatBudget = budget => {
  console.log('format budget');
  if (!budget) return null;
  const b = budget.split(' ');
  console.log(b);
  if (b.length < 2) return 0;

  let s = '';
  for (let i = 0; i < b.length; i += 1) {
    s += b[i];
  }
  return Number(s);
};

/*
 * Map fields
 */
export default record => {
  // Preprocess budget
  const budgetObject = {
    total_cost: formatBudget(record['total project budget']),
    eu_contrib: formatBudget(record['eu budget contribution']),
    private_fund: null,
    public_fund: null,
    other_contrib: null,
    funding_area: record.funds || null,
  };

  // Preprocess project locations
  const locationArray = [];
  const countryArray = record['project country']
    ? record['project country'].split('; ')
    : null;
  const previousCountries = [];
  if (countryArray.length > 1) {
    for (let i = 0; i < countryArray.length; i += 1) {
      if (previousCountries.indexOf(countryArray[i] !== -1)) {
        locationArray.push({
          country_name: null,
          country_code: countryArray[i].trim(),
          region: null,
          nuts2: null,
          location: {
            lat: 0,
            lon: 0,
          },
        });
        previousCountries.push(countryArray[i]);
      }
    }
  } else {
    locationArray.push({
      country_name: null,
      country_code: record['project country'],
      region: record['project region'],
      nuts2: record['project nuts2 code'],
      location: {
        lat: 0,
        lon: 0,
      },
    });
  }

  // Preprocess type
  const typeArray = [record['project type']];

  // Preprocess themes
  const themeArray = record.themes ? record.themes.split('; ') : null;

  // Preprocess partners
  const partnerArray = [
    {
      name: record.beneficiary,
      type: null,
      address: getAddress(record),
      region: null,
      country: record['beneficiary country'],
      website: null,
    },
  ];

  // Map the fields
  return {
    project_id: record.projectid.toString(),
    type: typeArray,
    period: record.period,
    publication_date: formatDate(record['date published']),
    title: record['project name'],
    project_locations: locationArray,
    themes: themeArray,
    budget: budgetObject,
    project_website: getProjectWebsite(record),
    partners: partnerArray,
    timeframe: {
      from: formatDate(record['project timeframe start date']),
      to: formatDate(record['project timeframe end date']),
    },
  };
};
