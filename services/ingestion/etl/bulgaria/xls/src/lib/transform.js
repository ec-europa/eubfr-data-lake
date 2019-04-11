import sanitizeBudgetItem from '@eubfr/lib/budget/budgetFormatter';

/**
 * Preprocess budget field.
 *
 * @memberof BulgariaXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Budget}
 */
const getBudget = () => ({
  total_cost: sanitizeBudgetItem(),
  eu_contrib: sanitizeBudgetItem(),
  private_fund: sanitizeBudgetItem(),
  public_fund: sanitizeBudgetItem(),
  other_contrib: sanitizeBudgetItem(),
  funding_area: [],
  mmf_heading: '',
});

/**
 * Preprocess `description` field.
 *
 * Input fields taken from the `record` are:
 * - `Summary of the Operation`
 *
 * @memberof BulgariaXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getProjectDescription = record =>
  record['Summary of the Operation'] || '';

/**
 * Preprocess `title` field.
 *
 * Input fields taken from the `record` are:
 * - `Operation Name`
 *
 * @memberof BulgariaXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getProjectTitle = record => record['Operation Name'] || '';

/**
 * Map fields for BULGARIAXLS producer, XLS and XLSX file types
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/bulgaria/xls/test/stubs/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/bulgaria/xls/src/lib/transform.js|implementation details}
 *
 * @name BulgariaXlsTransform
 * @param {Object} record Piece of data to transform before going to harmonized storage.
 * @returns {Project} JSON matching the type fields.
 */
export default record => {
  if (!record) return null;

  return {
    action: '',
    budget: getBudget(),
    call_year: '',
    description: getProjectDescription(record),
    ec_priorities: [],
    media: [],
    third_parties: [],
    programme_name: '',
    project_id: '',
    project_locations: '',
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
    themes: [],
    timeframe: '',
    title: getProjectTitle(record),
    type: [],
  };
};
