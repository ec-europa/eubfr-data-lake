// @flow

import type { Project } from '../../../../_types/Project';

/**
 * Map fields for WIFI4EU producer, XLS and XLSX file types
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/wifi4eu/xls/test/stubs/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/wifi4eu/xls/src/lib/transform.js|implementation details}
 * @name Wifi4EuXlsTransform
 * @param {Object} record Piece of data to transform before going to harmonized storage.
 * @returns {Project} JSON matching the type fields.
 */
export default (record: Object): Project => {
  console.log(`RECORD`);
  console.log(JSON.stringify(record));

  // Map the fields
  return {
    action: '',
    budget: {},
    call_year: '',
    coordinators: [],
    description: '',
    ec_priorities: [],
    media: {
      cover_image: '',
      video: '',
    },
    partners: [],
    programme_name: '',
    project_id: '',
    project_locations: [],
    project_website: '',
    related_links: [],
    results: {},
    status: '',
    sub_programme_name: '',
    success_story: '',
    themes: [],
    timeframe: {
      from: '',
      to: '',
    },
    title: '',
    type: [],
  };
};
