// @flow

import countries from 'i18n-iso-countries';
import getCountryCode from '@eubfr/lib/getCountryCode';
import extractBudgetData from '@eubfr/lib/budget/extractBudgetData';
import sanitizeBudgetItem from '@eubfr/lib/budget/budgetFormatter';
import type { Project } from '@eubfr/types';

/**
 * Transform message (DEVCO XLS)
 */

/**
 * Preprocess `budget`.
 *
 * Input fields taken from the `record` are:
 * - `Total EU Contribution (Million Euro)`
 * - `Total Budget (Million Euro)`
 * - `Investment Grant (Million Euro)`
 * - `TA (Million Euro)`
 * - `Interest Rate Subsidy (Million Euro)`
 * - `Guarantee (Million Euro)`
 * - `Equity (Million Euro)`
 * - `Budget Support (Million Euro)`
 * - `Loan (Million Euro)`
 *
 * @memberof DevcoXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Budget}
 */
const getBudget = record => {
  const euContribString = record['Total EU Contribution (Million Euro)']
    ? `EUR ${record['Total EU Contribution (Million Euro)']} million`
    : null;
  const euContrib = euContribString
    ? sanitizeBudgetItem(extractBudgetData(euContribString))
    : sanitizeBudgetItem();

  const totalCostString = record['Total Budget (Million Euro)']
    ? `EUR ${record['Total Budget (Million Euro)']} million`
    : null;
  const totalCost = totalCostString
    ? sanitizeBudgetItem(extractBudgetData(totalCostString))
    : sanitizeBudgetItem();

  const investmentGrantString = record['Investment Grant (Million Euro)']
    ? `EUR ${record['Investment Grant (Million Euro)']} million`
    : null;
  const investmentGrant = investmentGrantString
    ? sanitizeBudgetItem(extractBudgetData(investmentGrantString))
    : sanitizeBudgetItem();

  const taString = record['TA (Million Euro)']
    ? `EUR ${record['TA (Million Euro)']} million`
    : null;
  const ta = taString
    ? sanitizeBudgetItem(extractBudgetData(taString))
    : sanitizeBudgetItem();

  const interestRateString = record['Interest Rate Subsidy (Million Euro)']
    ? `EUR ${record['Interest Rate Subsidy (Million Euro)']} million`
    : null;
  const interestRate = interestRateString
    ? sanitizeBudgetItem(extractBudgetData(interestRateString))
    : sanitizeBudgetItem();

  const guaranteeString = record['Guarantee (Million Euro)']
    ? `EUR ${record['Guarantee (Million Euro)']} million`
    : null;
  const guarantee = guaranteeString
    ? sanitizeBudgetItem(extractBudgetData(guaranteeString))
    : sanitizeBudgetItem();

  const equityString = record['Equity (Million Euro)']
    ? `EUR ${record['Equity (Million Euro)']} million`
    : null;
  const equity = equityString
    ? sanitizeBudgetItem(extractBudgetData(equityString))
    : sanitizeBudgetItem();

  const budgetSupportString = record['Budget Support (Million Euro)']
    ? `EUR ${record['Budget Support (Million Euro)']} million`
    : null;
  const budgetSupport = budgetSupportString
    ? sanitizeBudgetItem(extractBudgetData(budgetSupportString))
    : sanitizeBudgetItem();

  const loanString = record['Loan (Million Euro)']
    ? `EUR ${record['Loan (Million Euro)']} million`
    : null;
  const loan = loanString
    ? sanitizeBudgetItem(extractBudgetData(loanString))
    : sanitizeBudgetItem();

  const budget = {
    devco_budget_support: budgetSupport,
    devco_equity: equity,
    devco_guarantee: guarantee,
    devco_interest_rate_subsidy: interestRate,
    devco_investment_grant: investmentGrant,
    devco_ta: ta,
    devco_loan: loan,
    eu_contrib: euContrib,
    funding_area: [],
    mmf_heading: '',
    other_contrib: sanitizeBudgetItem(),
    private_fund: sanitizeBudgetItem(),
    public_fund: sanitizeBudgetItem(),
    total_cost: totalCost,
  };

  return budget;
};

/**
 * Preprocess `comments`.
 *
 * Input fields taken from the `record` are:
 * - `Comments`
 *
 * @memberof DevcoXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getComments = record =>
  record.Comments ? record.Comments.replace(/ +(?= )/g, '').trim() : '';

/**
 * Preprocess `description`.
 *
 * Input fields taken from the `record` are:
 * - `Description and main objectives`
 *
 * @memberof DevcoXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getDescription = record =>
  record['Description and main objectives']
    ? record['Description and main objectives'].trim()
    : '';

/**
 * Preprocess `devco_cris_number`.
 *
 * Input fields taken from the `record` are:
 * - `CRIS No or ExCom Des`
 *
 * @memberof DevcoXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {SimpleValueField}
 */
const getCrisNumber = record => {
  const number = {
    raw: '',
    formatted: '',
  };

  if (record['CRIS No or ExCom Des']) {
    number.raw = record['CRIS No or ExCom Des'];
  }

  return number;
};

/**
 * Preprocess `devco_lead_investor`.
 *
 * Input fields taken from the `record` are:
 * - `Lead Financier`
 *
 * @memberof DevcoXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {SimpleValueField}
 */
const getInvestor = record => {
  const investor = {
    raw: '',
    formatted: '',
  };

  if (record['Lead Financier']) {
    investor.raw = record['Lead Financier'];
  }

  return investor;
};

/**
 * Preprocess `devco_leverage`.
 *
 * Input fields taken from the `record` are:
 * - `Leverage`
 *
 * @memberof DevcoXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {SimpleValueField}
 */
const getLeverage = record => {
  const leverage = {
    raw: '',
    formatted: '',
  };

  if (record.Leverage) {
    leverage.raw = record.Leverage;
  }

  return leverage;
};

/**
 * Preprocess `devco_results_indicators`.
 *
 * Input fields taken from the `record` are:
 *
 * - `1.1 Access on grid electricity ('000 people)`
 * - `1.2 Access mini grid electricity ('000 people)`
 * - `1.3 Access off-grid electricity ('000 people)`
 * - `1.4 Inferred access (additional generation) ('000 people)`
 * - `1.5 Inferred access (cross-border transmission) ('000 people)`
 * - `1.6 Access to biomass/biogas clean cooking ('000 people)`
 * - `1.7 Access to LPG/ethanol cooking ('000 people)`
 * - `1.8 Electricity from renewables (GWh/year)`
 * - `1.9 Renewable generation capacity (MW)`
 * - `1.10 Electricity from energy efficiency (liberated capacity) (MW)`
 * - `1.11 Transmission lines (km)`
 * - `1.12 Distribution lines (km)`
 * - `1.13 Energy Savings (MWh/year)`
 * - `1.14 GHG emissions avoided per year (ktons CO2eq)`
 * - `1.15 No of direct jobs person/year (construction)`
 * - `1.16 No of permanent jobs (operation)`
 * - `2.1 Direct and Inferred electricity access ('000 people)`
 * - `2.2 Clean cooking and fuel access ('000 people)`
 * - `2.3 Direct and Inferred access to energy ('000 people)`
 * - `2.4 Electricity from renewabes (GWh/year)`
 * - `2.5 Reneable generation capacity (MW)`
 * - `2.6 Electricity generation capacity (MW)`
 * - `2.7 Transmission and distribution lines (km)`
 * - `2.8 GHG emissions avoided per year (ktons CO2eq)`
 * - `2.9 No of direct and permanent jons (construction and operation)`
 * - `BET1 (Access to energy)`
 * - `BET2 (Renewable energy generation and energy efficiency)`
 * - `BET3 (Contribution to the fight against climate change)`
 * - `EURF 1 (No of people provided with access to electricity with EU support)`
 * - `EURF 2 (Renewable energy production supported by the EU)`
 * - `EURF 3 (GHG emission avoided)`
 * - `SDG 7.1.1 Percentage of population with access to electricity)`
 * - `SDG 7.1.2 (Proportion of population with primary reliance on clean fuels and technology)`
 * - `SDG 7.2.1 Renewable energy share in the total final energy consumption)`
 * - `SDG 7.3.1 (Energy intensity measured in terms of primary energy and GDP)`
 * - `SDG 8.3.1 (Proportion of informal employement in non-agriculture employment, by sex)`
 *
 * @memberof DevcoXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<TypedValueField>}
 */
const getResultsIndicators = record => {
  const indicators = [];

  const wordsToRemove = [
    'of',
    'the',
    'in',
    'on',
    'at',
    'to',
    'a',
    'is',
    'with',
    'and',
  ];
  const removeWords = new RegExp(`\\b(${wordsToRemove.join('|')})\\b`, 'g');

  const fields = [
    "1.1 Access on grid electricity ('000 people)",
    "1.2 Access mini grid electricity ('000 people)",
    "1.3 Access off-grid electricity ('000 people)",
    "1.4 Inferred access (additional generation) ('000 people)",
    "1.5 Inferred access (cross-border transmission) ('000 people)",
    "1.6 Access to biomass/biogas clean cooking ('000 people)",
    "1.7 Access to LPG/ethanol cooking ('000 people)",
    '1.8 Electricity from renewables (GWh/year)',
    '1.9 Renewable generation capacity (MW)',
    '1.10 Electricity from energy efficiency (liberated capacity) (MW)',
    '1.11 Transmission lines (km)',
    '1.12 Distribution lines (km)',
    '1.13 Energy Savings (MWh/year)',
    '1.14 GHG emissions avoided per year (ktons CO2eq)',
    '1.15 No of direct jobs person/year (construction)',
    '1.16 No of permanent jobs (operation)',
    "2.1 Direct and Inferred electricity access ('000 people)",
    "2.2 Clean cooking and fuel access ('000 people)",
    "2.3 Direct and Inferred access to energy ('000 people)",
    '2.4 Electricity from renewabes (GWh/year)',
    '2.5 Reneable generation capacity (MW)',
    '2.6 Electricity generation capacity (MW)',
    '2.7 Transmission and distribution lines (km)',
    '2.8 GHG emissions avoided per year (ktons CO2eq)',
    '2.9 No of direct and permanent jons (construction and operation)',
    'BET1 (Access to energy)',
    'BET2 (Renewable energy generation and energy efficiency)',
    'BET3 (Contribution to the fight against climate change)',
    'EURF 1 (No of people provided with access to electricity with EU support)',
    'EURF 2 (Renewable energy production supported by the EU)',
    'EURF 3 (GHG emission avoided)',
    'SDG 7.1.1 Percentage of population with access to electricity)',
    'SDG 7.1.2 (Proportion of population with primary reliance on clean fuels and technology)',
    'SDG 7.2.1 Renewable energy share in the total final energy consumption)',
    'SDG 7.3.1 (Energy intensity measured in terms of primary energy and GDP)',
    'SDG 8.3.1 (Proportion of informal employement in non-agriculture employment, by sex)',
  ];

  fields.forEach(field => {
    if (field in record) {
      // Remove unnecessary numbers with dots.
      let fieldLabel = field
        // remove 1.1
        .replace(/(\d\.\d+)+/g, '')
        // remove .1
        .replace(/(\.\d+)+/g, '')
        // replace '  ' to ''
        .replace(/\s\s+/g, ' ')
        .replace(removeWords, '')
        .trim();

      // Fields of some abbreviations could be without brackets.
      if (
        fieldLabel.includes('BET') ||
        fieldLabel.includes('EURF') ||
        fieldLabel.includes('SDG')
      ) {
        fieldLabel = fieldLabel.replace(/[{()}]/g, '');
      }

      // Name it like a field.
      fieldLabel = fieldLabel
        .replace(/ /g, '_')
        .replace(/,/g, '')
        .replace(/'/g, '')
        .replace(/[(|)]/g, '')
        .replace(/\//g, '')
        .replace(/-/g, '_')
        .replace(/-/g, '_')
        .replace(/__/g, '_')
        .replace(/__/g, '_')
        .toLowerCase();

      const indicator = {
        field: fieldLabel,
        type: 'indicator',
        raw: record[field],
        formatted: '',
      };

      indicators.push(indicator);
    }
  });

  return indicators;
};

/**
 * Preprocess `devco_project_stage`.
 *
 * Input fields taken from the `record` are:
 * - `Project Stage`
 *
 * @memberof DevcoXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {SimpleValueField}
 */
const getProjectStage = record => {
  const stage = {
    raw: '',
    formatted: '',
  };

  if (record['Project Stage']) {
    stage.raw = record['Project Stage'];
  }

  return stage;
};

/**
 * Preprocess `devco_date_entry`.
 *
 * Input fields taken from the `record` are:
 * - `Date of data entry`
 *
 * @memberof DevcoXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Date} The date formatted into an ISO 8601 date format
 */
const getDateEntry = record => {
  let date = null;

  if (record['Date of data entry']) {
    const dateParts = record['Date of data entry']
      .split('/')
      .map(d => d.trim());

    const [m, y] = dateParts;

    if (m && y) {
      date = new Date(Date.UTC(y, m - 1, 1)).toISOString();
    }
  }

  return date;
};

/**
 * Preprocess `devco_arei_projects_endorsement`.
 *
 * Input fields taken from the `record` are:
 * - `For AREI Projects (Endorsement) Y/N`
 *
 * @memberof DevcoXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {SimpleValueField}
 */
const getAreiProjectsEndorsement = record => {
  const arei = {
    raw: '',
    formatted: '',
  };

  if (record['For AREI Projects (Endorsement) Y/N']) {
    arei.raw = record['For AREI Projects (Endorsement) Y/N'];
  }

  return arei;
};

/**
 * Gets country code from a country name.
 *
 * @memberof DevcoXlsTransform
 * @param {String} countryName The name of the country
 * @returns {String} The ISO 3166-1 country code
 */
const getCodeByCountry = countryName =>
  countries.getAlpha2Code(countryName, 'en');

/**
 * Preprocess `project_locations`.
 *
 * Input fields taken from the `record` are:
 * - `Country`
 * - `Region`
 *
 * @memberof DevcoXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array}
 */
const getLocations = record => {
  const locations = [];
  const code = getCountryCode(getCodeByCountry(record.Country));

  if (code) {
    locations.push({
      country_code: code,
      region: record.Region || '',
      nuts: [],
      address: '',
      postal_code: '',
      town: '',
      centroid: null,
      location: null,
    });
  }

  return locations;
};

/**
 * Preprocess `results`.
 *
 * Input fields taken from the `record` are:
 *
 * - `1.1 Access on grid electricity ('000 people)`
 * - `1.2 Access mini grid electricity ('000 people)`
 * - `1.3 Access off-grid electricity ('000 people)`
 * - `1.4 Inferred access (additional generation) ('000 people)`
 * - `1.5 Inferred access (cross-border transmission) ('000 people)`
 * - `1.6 Access to biomass/biogas clean cooking ('000 people)`
 * - `1.7 Access to LPG/ethanol cooking ('000 people)`
 * - `1.8 Electricity from renewables (GWh/year)`
 * - `1.9 Renewable generation capacity (MW)`
 * - `1.10 Electricity from energy efficiency (liberated capacity) (MW)`
 * - `1.11 Transmission lines (km)`
 * - `1.12 Distribution lines (km)`
 * - `1.13 Energy Savings (MWh/year)`
 * - `1.14 GHG emissions avoided per year (ktons CO2eq)`
 * - `1.15 No of direct jobs person/year (construction)`
 * - `1.16 No of permanent jobs (operation)`
 * - `2.1 Direct and Inferred electricity access ('000 people)`
 * - `2.2 Clean cooking and fuel access ('000 people)`
 * - `2.3 Direct and Inferred access to energy ('000 people)`
 * - `2.4 Electricity from renewabes (GWh/year)`
 * - `2.5 Reneable generation capacity (MW)`
 * - `2.6 Electricity generation capacity (MW)`
 * - `2.7 Transmission and distribution lines (km)`
 * - `2.8 GHG emissions avoided per year (ktons CO2eq)`
 * - `2.9 No of direct and permanent jons (construction and operation)`
 * - `BET1 (Access to energy)`
 * - `BET2 (Renewable energy generation and energy efficiency)`
 * - `BET3 (Contribution to the fight against climate change)`
 * - `EURF 1 (No of people provided with access to electricity with EU support)`
 * - `EURF 2 (Renewable energy production supported by the EU)`
 * - `EURF 3 (GHG emission avoided)`
 * - `SDG 7.1.1 Percentage of population with access to electricity)`
 * - `SDG 7.1.2 (Proportion of population with primary reliance on clean fuels and technology)`
 * - `SDG 7.2.1 Renewable energy share in the total final energy consumption)`
 * - `SDG 7.3.1 (Energy intensity measured in terms of primary energy and GDP)`
 * - `SDG 8.3.1 (Proportion of informal employement in non-agriculture employment, by sex)`
 *
 * @memberof DevcoXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Result}
 */
const getResults = record => {
  let resultIsAvailable = false;
  let resultsContents = '';

  const fields = [
    "1.1 Access on grid electricity ('000 people)",
    "1.2 Access mini grid electricity ('000 people)",
    "1.3 Access off-grid electricity ('000 people)",
    "1.4 Inferred access (additional generation) ('000 people)",
    "1.5 Inferred access (cross-border transmission) ('000 people)",
    "1.6 Access to biomass/biogas clean cooking ('000 people)",
    "1.7 Access to LPG/ethanol cooking ('000 people)",
    '1.8 Electricity from renewables (GWh/year)',
    '1.9 Renewable generation capacity (MW)',
    '1.10 Electricity from energy efficiency (liberated capacity) (MW)',
    '1.11 Transmission lines (km)',
    '1.12 Distribution lines (km)',
    '1.13 Energy Savings (MWh/year)',
    '1.14 GHG emissions avoided per year (ktons CO2eq)',
    '1.15 No of direct jobs person/year (construction)',
    '1.16 No of permanent jobs (operation)',
    "2.1 Direct and Inferred electricity access ('000 people)",
    "2.2 Clean cooking and fuel access ('000 people)",
    "2.3 Direct and Inferred access to energy ('000 people)",
    '2.4 Electricity from renewabes (GWh/year)',
    '2.5 Reneable generation capacity (MW)',
    '2.6 Electricity generation capacity (MW)',
    '2.7 Transmission and distribution lines (km)',
    '2.8 GHG emissions avoided per year (ktons CO2eq)',
    '2.9 No of direct and permanent jons (construction and operation)',
    'BET1 (Access to energy)',
    'BET2 (Renewable energy generation and energy efficiency)',
    'BET3 (Contribution to the fight against climate change)',
    'EURF 1 (No of people provided with access to electricity with EU support)',
    'EURF 2 (Renewable energy production supported by the EU)',
    'EURF 3 (GHG emission avoided)',
    'SDG 7.1.1 Percentage of population with access to electricity)',
    'SDG 7.1.2 (Proportion of population with primary reliance on clean fuels and technology)',
    'SDG 7.2.1 Renewable energy share in the total final energy consumption)',
    'SDG 7.3.1 (Energy intensity measured in terms of primary energy and GDP)',
    'SDG 8.3.1 (Proportion of informal employement in non-agriculture employment, by sex)',
  ];

  fields.forEach(field => {
    if (field in record) {
      if (record[field] !== ' n/a ') {
        // Remove unnecessary numbers with dots.
        let fieldLabel = field
          // remove 1.1
          .replace(/(\d\.\d+)+/g, '')
          // remove .1
          .replace(/(\.\d+)+/g, '')
          // replace '  ' to ''
          .replace(/\s\s+/g, ' ')
          .trim();

        // Fields of some abbreviations could be without brackets.
        if (
          fieldLabel.includes('BET') ||
          fieldLabel.includes('EURF') ||
          fieldLabel.includes('SDG')
        ) {
          fieldLabel = fieldLabel.replace(/[{()}]/g, '');
        }

        const fieldValue = `${fieldLabel}: ${record[field]} \n`;
        resultsContents += fieldValue;
        resultIsAvailable = 'yes';
      }
    }
  });

  const results = {
    available: resultIsAvailable || '',
    result: resultsContents,
  };

  return results;
};

/**
 * Preprocess `type`.
 *
 * @memberof DevcoXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array} Project types
 */
const getType = record =>
  record['Project Type']
    ? record['Project Type']
        .split(',')
        .map(el => el.trim())
        .filter(type => type)
    : [];

/**
 * Map fields for DEVCO producer, CSV file types
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/devco/csv/test/stubs/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/devco/csv/src/lib/transform.js|implementation details}
 * @name DevcoXlsTransform
 * @param {Object} record Piece of data to transform before going to harmonized storage.
 * @returns {Project} JSON matching the type fields.
 */
export default (record: Object): Project | null => {
  if (!record) return null;

  // Map the fields
  return {
    action: '',
    budget: getBudget(record),
    call_year: '',
    comments: getComments(record),
    description: getDescription(record),
    ec_priorities: [],
    devco_cris_number: getCrisNumber(record),
    devco_lead_investor: getInvestor(record),
    devco_leverage: getLeverage(record),
    devco_results_indicators: getResultsIndicators(record),
    devco_project_stage: getProjectStage(record),
    devco_date_entry: getDateEntry(record),
    devco_arei_projects_endorsement: getAreiProjectsEndorsement(record),
    media: [],
    programme_name: record['Funding Source'] || '',
    project_id: record.ID || '',
    project_locations: getLocations(record),
    project_website: '',
    complete: true,
    related_links: [],
    reporting_organisation: 'DEVCO',
    results: getResults(record),
    status: record['Contract Status'] || '',
    sub_programme_name: '',
    success_story: '',
    themes: [],
    third_parties: [],
    timeframe: {
      from: record['Starting Date']
        ? new Date(String(record['Starting Date'])).toISOString()
        : null,
      from_precision: 'year',
      to: record['Ending Date']
        ? new Date(String(record['Ending Date'])).toISOString()
        : null,
      to_precision: 'year',
    },
    title: record['Project Title'] || '',
    type: getType(record),
  };
};
