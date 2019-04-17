/*
 * Transform message (2014tc16rfcb014 CSV)
 */

/**
 * Map fields for 2014tc16rfcb014 producer, CSV file types
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014tc16rfcb014/csv/test/stubs/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014tc16rfcb014/csv/src/lib/transform.js|implementation details}
 * @name 2014tc16rfcb014CsvTransform
 * @param {Object} record Piece of data to transform before going to harmonized storage.
 * @returns {Project} JSON matching the type fields.
 */

export default record => {
  if (!record) return null;

  // Map the fields
  return {
    action: '',
    budget: {},
    call_year: '',
    description: '',
    ec_priorities: [],
    media: [],
    programme_name: '',
    project_id: '',
    project_locations: '',
    project_website: '',
    complete: false,
    related_links: [],
    reporting_organisation: 'Member states',
    results: {
      available: '',
      result: '',
    },
    status: '',
    sub_programme_name: '',
    success_story: '',
    themes: [],
    third_parties: [],
    timeframe: {},
    title: '',
    type: [],
  };
};
