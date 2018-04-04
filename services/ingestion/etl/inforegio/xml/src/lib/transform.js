// @flow

/*
 * Transform message (INFOREGIO XML)
 */

import type { Project } from '../../../../_types/Project';

/**
 * Check if field is an array or a sting
 *
 * @memberof inforegioXmlTransform
 * @param {Object|string} data The input piece of data
 * @returns {string} The string value of the input data
 *
 * @example
 * input => ['foo']
 * output => 'foo'
 */
const checkData = data => {
  if (data && typeof data === 'object') {
    return data[0];
  } else if (data && typeof data === 'string') {
    return data;
  }
  return '';
};

/**
 * Format date
 *
 * @memberof inforegioXmlTransform
 * @param {Date} date Date in `DD/MM/YYYY` format
 * @returns {Date} The date formatted into an ISO 8601 date format
 *
 * @example
 * input => "02/02/2018"
 * output => '2018-02-02T00:00:00.000Z'
 */
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

/**
 * Get adress from different fields
 *
 * Input fields taken from the `record` are:
 *
 * - `Beneficiary_address`
 * - `Beneficiary_Post_Code`
 * - `Beneficiary_City`
 *
 * @memberof inforegioXmlTransform
 * @param {Object} record The row received from harmonized storage
 * @returns {string} The address as consumed by {Partner}
 */
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

/**
 * Formats information for the `value` of {BudgetItem}
 *
 * @memberof inforegioXmlTransform
 * @param {string} budget Prefixed currency value
 * @returns {number} The value for `value` of {BudgetItem}
 *
 * @example
 * input => "EUR 329 000 000"
 * output => "329000000"
 */
const formatBudget = budget => {
  if (!budget || typeof budget !== 'string') return 0;

  const formattedBudget = budget
    .split(' ')
    .slice(1)
    .join('');

  return Number(formattedBudget) || 0;
};

/**
 * Get funding areas from a string
 *
 * Input fields taken from the `record` are:
 *
 * - `Funds`
 *
 * @memberof inforegioXmlTransform
 * @param {Object} record The row received from harmonized storage
 * @returns {Array} List of values for funding area
 *
 * @example
 * input => 'foo;bar;baz'
 * output => ['foo', 'bar', 'baz']
 */
const getFundingArea = record =>
  checkData(record.Funds)
    .split(';')
    .filter(item => item);

/**
 * Get a list of {Location}
 *
 * Input fields taken from the `record` are:
 *
 * - `Project_country`
 * - `Project_region`
 * - `Project_NUTS2_code`
 *
 * @memberof inforegioXmlTransform
 * @param {Object} record The row received from harmonized storage
 * @returns {Array} List of {Location}
 */
const getLocations = record => {
  const locationArray = [];
  const previousCountries = [];

  const countryArray = record.Project_country
    ? checkData(record.Project_country)
        .toString()
        .split('; ')
        .filter(country => country)
    : null;

  if (countryArray !== null && countryArray.length > 1) {
    for (let i = 0; i < countryArray.length; i += 1) {
      if (previousCountries.indexOf(countryArray[i] === -1)) {
        locationArray.push({
          country_code: countryArray[i],
          region: '',
          nuts: [],
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

  return locationArray;
};

/**
 * Get themes from a string
 *
 * Input fields taken from the `record` are:
 *
 * - `Themes`
 *
 * @memberof inforegioXmlTransform
 * @param {Object} record The row received from harmonized storage
 * @returns {Array} List of values for themes
 *
 * @example
 * input => 'foo; bar; baz'
 * output => ['foo', 'bar', 'baz']
 */
const getThemes = record =>
  record.Themes
    ? checkData(record.Themes)
        .toString()
        .split('; ')
        .filter(theme => theme)
    : [];

/**
 * Get a list of a single {Beneficiary}
 * Depends on getAddress()
 *
 * Input fields taken from the `record` are:
 *
 * - `Beneficiary`
 * - `Beneficiary_Country`
 *
 * @memberof inforegioXmlTransform
 * @param {Object} record The row received from harmonized storage
 * @returns {Array} List of a single {Beneficiary}
 */
const getBeneficiaries = record =>
  record.Beneficiary
    ? [
        {
          name: checkData(record.Beneficiary),
          type: '',
          address: getAddress(record),
          region: '',
          role: 'beneficiary',
          country: checkData(record.Beneficiary_Country),
          website: '',
          phone: '',
          email: '',
        },
      ]
    : [];

/**
 * Map fields for INFOREGIO producer, XML file types
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/inforegio/xml/src/lib/transform.js|implementation details}
 * @name inforegioXmlTransform
 * @param {Object} record The row received from harmonized storage
 * @returns {Project} JSON matching the type fields
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
    funding_area: getFundingArea(record),
    mmf_heading: '',
  };

  // Preprocess project locations
  const locationArray = getLocations(record);

  // Preprocess type
  const typeArray = record.Project_type || [];

  // Preprocess themes
  const themeArray = getThemes(record);

  // Preprocess third parties
  const thirdPartiesArray = getBeneficiaries(record);

  // Map the fields
  return {
    action: '',
    budget: budgetObject,
    call_year: '',
    description: checkData(record.quote),
    ec_priorities: [],
    media: {
      cover_image: '',
      video: '',
    },
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
    third_parties: thirdPartiesArray,
    timeframe: {
      from: formatDate(checkData(record.Project_Timeframe_start_date)),
      to: formatDate(checkData(record.Project_Timeframe_end_date)),
    },
    title: checkData(record.Project_name),
    type: typeArray,
  };
};
