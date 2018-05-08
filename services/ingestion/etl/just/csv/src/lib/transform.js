// @flow

/*
 * Transform message (JUST CSV)
 */

import type { Project } from '../../../../_types/Project';

/**
 * Format date
 *
 * @memberof JustCsvTransform
 * @param {Date} date Date in timestamp
 * @returns {Date} The date formatted into an ISO 8601 date format
 *
 * @example
 * input => "1388530800"
 * output => "2013-12-31T23:00:00.000Z"
 */
const formatDate = date =>
  date ? new Date(parseInt(date, 10) * 1000).toISOString() : null;

/**
 * Map fields for JUST producer, CSV file types
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/just/csv/test/stubs/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/just/csv/src/lib/transform.js|implementation details}
 * @name JustCsvTransform
 * @param {Object} record Piece of data to transform before going to harmonized storage.
 * @returns {Project} JSON matching the type fields.
 */
export default (record: Object): Project => {
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
    project_locations: {},
    project_website: '',
    related_links: links,
    reporting_organisation: '',
    results: resultObject,
    status: '',
    sub_programme_name: '',
    success_story: '',
    themes: [],
    third_parties: [],
    timeframe: {
      from: null,
      to: null,
    },
    title: '',
    type: [],
  };
};
