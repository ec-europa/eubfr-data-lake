// import type { Project } from '@eubfr/types';
import sanitizeBudgetItem from '@eubfr/lib/budget/budgetFormatter';

/**
 * Preprocess `budget`.
 *
 * Input fields taken from the `record` are:
 * - `Total Budget/Spesa totale`
 * - `ERDF Contribution/FESR confinanziamento`
 *
 * @memberof 2014tc16m4tn002XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Budget}
 */

const getBudget = record => ({
  total_cost: sanitizeBudgetItem({
    value: record['Total Budget/Spesa totale'],
    currency: 'EUR',
    raw: record['Total Budget/Spesa totale'],
  }),
  eu_contrib: sanitizeBudgetItem({
    value: record['ERDF Contribution/FESR confinanziamento'],
    currency: 'EUR',
    raw: record['ERDF Contribution/FESR confinanziamento'],
  }),
  private_fund: sanitizeBudgetItem(),
  public_fund: sanitizeBudgetItem(),
  other_contrib: sanitizeBudgetItem(),
  funding_area: '',
  mmf_heading: '',
});

/**
 * Preprocess `description`.
 *
 * Input fields taken from the `record` are:
 * - `Project acronym/Acronimo del progetto`
 * - `OPERATION SUMMARY / Sintesi dell'operazione`
 *
 * @memberof 2014tc16m4tn002XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getDescription = record => {
  const desc = {};
  let description = '';

  desc['Acronym'] = record['Project acronym/Acronimo del progetto'] || '';
  desc['Operation summary'] =
    record["OPERATION SUMMARY / Sintesi dell'operazione"] || '';

  Object.keys(desc).forEach(descriptionField => {
    description += `${descriptionField}: ${desc[descriptionField]} \n`;
  });

  return description;
};

/**
 * Preprocess `project_id`.
 *
 * Input fields taken from the `record` are:
 * - `Project Number/Codice del progetto`
 *
 * @memberof 2014tc16m4tn002XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getProjectId = record =>
  record['Project Number/Codice del progetto'] || '';

const getLocations = record => [];

const getThemes = record => [];

const getThirdParties = record => [];

const getTimeframe = record => [];

const getTitle = record => '';

/**
 * Map fields for 2014tc16m4tn002 producer, XLS file types
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014tc16m4tn002/xls/test/stubs/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014tc16m4tn002/xls/src/lib/transform.js|implementation details}
 * @name 2014tc16m4tn002XlsTransform
 * @param {Object} record Piece of data to transform before going to harmonized storage.
 * @returns {Project} JSON matching the type fields.
 */
// export default (record: Object): Project | null => {
export default record => {
  if (!record) return null;

  // Map the fields
  return {
    action: '',
    budget: getBudget(record),
    call_year: '',
    description: getDescription(record),
    ec_priorities: [],
    media: [],
    programme_name: '',
    project_id: getProjectId(record),
    project_locations: getLocations(record),
    project_website: '',
    complete: false,
    related_links: [],
    reporting_organisation: 'REGIO',
    results: {
      available: '',
      result: '',
    },
    status: '',
    sub_programme_name: '',
    success_story: '',
    themes: getThemes(record),
    third_parties: getThirdParties(record),
    timeframe: getTimeframe(record),
    title: getTitle(record),
    type: [],
  };
};
