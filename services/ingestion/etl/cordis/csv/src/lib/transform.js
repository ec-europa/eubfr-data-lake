// @flow

import sanitizeBudgetItem from '@eubfr/lib/budget/budgetFormatter';
import getCountryCode from '@eubfr/lib/getCountryCode';
import type { Project } from '@eubfr/types';

/*
 * Transform message (CORDIS CSV)
 */

/**
 * Preprocess `funding_area`
 * Input fields taken from the `record` are:
 * - `fundingScheme`
 * - `Activity Area` (FP4)
 *
 * @memberof CordisCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array}
 */

const getFundingArea = record => {
  const areas = [];
  // Places where one can find information about the field.
  const fields = ['fundingScheme', 'Activity Area'];

  fields.forEach(field => {
    if (record[field]) {
      const fundingAreas = record[field].split(';').filter(a => a);
      areas.push(...fundingAreas);
    }
  });

  return areas;
};

/**
 * Get total cost before formatting.
 *
 * Input fields taken from the `record` are:
 * - `totalCost` (FR1-3 + FP5-7)
 * - `Total Cost` (FP4)
 *
 * @memberof CordisCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getTotalCost = record => record.totalCost || record['Total Cost'] || '';

/**
 * Preprocess budget
 *
 * @memberof CordisCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Budget}
 */

const getBudget = record => {
  const totalCost = getTotalCost(record);

  let euContrib = {
    eu_contrib: sanitizeBudgetItem(),
  };

  const budget = {
    total_cost: sanitizeBudgetItem({
      value: Math.floor(totalCost),
      currency: 'EUR',
      raw: totalCost,
    }),
    private_fund: sanitizeBudgetItem(),
    public_fund: sanitizeBudgetItem(),
    other_contrib: sanitizeBudgetItem(),
    funding_area: getFundingArea(record),
    mmf_heading: record.call || '',
  };

  // If ecMaxContribution is given and it's not a percentage, use it
  if (record.ecMaxContribution && record.ecMaxContribution > 100) {
    euContrib = {
      eu_contrib: sanitizeBudgetItem({
        value: Math.floor(record.ecMaxContribution),
        currency: 'EUR',
        raw: record.ecMaxContribution,
      }),
    };
  }

  return Object.assign({}, budget, euContrib);
};

/**
 * Preprocess description
 * Concatenation of several fields as requested in https://webgate.ec.europa.eu/CITnet/jira/browse/EUBFR-200?focusedCommentId=2808845&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-2808845
 * Input fields taken from the `record` are:
 * - `acronym` or `Project Acronym` (FP4)
 * - `objective` or `Objectives` (FP4)
 * - `General Information` (FP4)
 * - `rcn` or `RCN` (FP4)
 * - `topic`
 *
 * @memberof CordisCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getDescription = record => {
  const description = {};
  const fields = [
    'rcn',
    'RCN',
    'acronym',
    'Project Acronym',
    'topics',
    'objective',
    'Objectives',
    'General Information',
  ];

  fields.forEach(field => {
    if (record[field]) {
      description[field] = record[field];
    }
  });

  return Object.keys(description)
    .map(key => `${key}: ${description[key]}`)
    .join('\n');
};

/**
 * Preprocess `project_id`
 * Seeks for values in the following precedence:
 * - `id`
 * - `reference`
 * - `Contract Number` (FP4)
 *
 * @memberof CordisCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getProjectId = record =>
  record.id || record.reference || record['Contract Number'] || '';

/**
 * Preprocess `programme_name`
 * Seeks for values in the following precedence:
 * - `frameworkProgramme`
 * - `Framework Programme` (FP4)
 *
 * @memberof CordisCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getFrameworkProgramme = record =>
  record.frameworkProgramme || record['Framework Programme'] || '';

const getCode = code => (code ? getCountryCode(code.trim().toUpperCase()) : '');

/**
 * Preprocess project_locations
 * Input fields taken from the `record` are:
 * - `participants`
 * - `participantCountries`
 *
 * @memberof CordisCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array} List of {Location} objects for `project_locations` field
 */

const getLocations = record => {
  const locations = [];

  if (record.participantCountries) {
    const loc = record.participantCountries
      .split(';')
      // Remove empty
      .filter(country => country)
      .map(country => {
        const code = getCode(country);

        if (code) {
          return {
            country_code: code,
            region: '',
            nuts: [],
            address: '',
            postal_code: '',
            town: '',
            centroid: null,
            location: null,
          };
        }

        return '';
      })
      // Remove empty
      .filter(country => country);

    locations.push(...loc);
  }

  return locations;
};

/**
 * Preprocess third parties
 * Input fields taken from the `record` are:
 * - `coordinator`
 * - `coordinatorCountry`
 * - `participants`
 * - `participantCountries`
 *
 * @memberof CordisCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array} List of {ThirdParty} objects
 */

const getThirdParties = record => {
  const thirdParties = [];

  if (record.coordinator) {
    thirdParties.push({
      name: record.coordinator,
      type: '',
      address: '',
      region: '',
      role: 'coordinator',
      country: record.coordinatorCountry || '',
      website: '',
      phone: '',
      email: '',
    });
  }

  if (record.participants) {
    const participants = record.participants
      .split(';')
      .filter(participant => participant)
      .map(participant => ({
        name: participant.trim(),
        type: '',
        address: '',
        region: '',
        role: 'participant',
        website: '',
        phone: '',
        email: '',
      }));

    record.participantCountries
      .split(';')
      .filter(participantCountry => participantCountry)
      .forEach((country, participantKey) => {
        if (participants[participantKey]) {
          const countryCode = country.trim().toUpperCase();
          participants[participantKey].country = getCountryCode(countryCode);
        }
      });

    thirdParties.push(...participants);
  }

  return thirdParties;
};

/**
 * Format date
 *
 * @memberof CordisCsvTransform
 * @param {Date} date Date in `YYYY-MM-DD` or `DD/MM/YYYY` formats.
 * @returns {Date} The date formatted into an ISO 8601 date format
 *
 * @example
 * input => "2018-12-31"
 * output => "2018-12-31T00:00:00.000Z"
 *
 * @example
 * input => "01/01/1986"
 * output => '1986-01-01T00:00:00.000Z'
 */

const formatDate = date => {
  if (!date || typeof date !== 'string') return null;

  // Case `DD/MM/YYYY`:
  if (date.includes('/')) {
    const d = date.split(/\//);
    if (d.length !== 3) return null;
    const [day, month, year] = d;
    if (!day || !month || !year) return null;
    try {
      return new Date(Date.UTC(year, month - 1, day)).toISOString();
    } catch (e) {
      return null;
    }
  }
  // Case `YYYY-MM-DD`:
  try {
    return new Date(date).toISOString();
  } catch (e) {
    return null;
  }
};

/**
 * Preprocess `project_website`
 *
 * Input fields taken from the `record` are:
 * - `projectUrl` (FR1-3 + FP5-7)
 * - `Project Website` (FP4)
 *
 * @memberof CordisCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getProjectWebsite = record =>
  record['Project Website'] || record.projectUrl || '';

/**
 * Preprocess `status`
 *
 * Input fields taken from the `record` are:
 * - `status` (FR1-3 + FP5-7)
 * - `Status` (FP4)
 *
 * @memberof CordisCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getStatus = record => record.status || record.Status || '';

/**
 * Preprocess `themes`
 *
 * Input fields taken from the `record` are:
 * - `Keywords` (FP4)
 * - `Subject` (FP4)
 *
 * @memberof CordisCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getThemes = record => {
  const themes = [];

  // Places where one can find information about the field.
  const fields = ['Keywords', 'Subject'];

  fields.forEach(field => {
    if (record[field]) {
      const topics = record[field].split(';').filter(t => t);
      themes.push(...topics);
    }
  });

  return themes;
};

/**
 * Preprocess `title`
 * Input fields taken from the `record` are:
 * - `title` (FR1-3 + FP5-7)
 * - `Project Title` (FP4)
 *
 * @memberof CordisCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getProjectTitle = record => record.title || record['Project Title'] || '';

/**
 * Get starting date before formatting.
 *
 * Input fields taken from the `record` are:
 * - `startDate` (FR1-3 + FP5-7)
 * - `Start Date`(FP4)
 *
 * @memberof CordisCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getStartDate = record =>
  record.startDate || record['Start Date'] || record['End Date'] || null;

/**
 * Get end date before formatting.
 *
 * Input fields taken from the `record` are:
 * - `endDate` (FR1-3 + FP5-7)
 * - `End Date` (FP4)
 *
 * @memberof CordisCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getEndDate = record => record.endDate || record['End Date'] || null;

/**
 * Map fields for CORDIS producer, CSV file types
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/cordis/csv/test/stubs/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/cordis/csv/src/lib/transform.js|implementation details}
 * @name CordisCsvTransform
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
    description: getDescription(record),
    ec_priorities: [],
    media: [],
    programme_name: getFrameworkProgramme(record),
    project_id: getProjectId(record),
    project_locations: getLocations(record),
    project_website: getProjectWebsite(record),
    complete: false,
    related_links: [],
    reporting_organisation: 'RTD',
    results: {
      available: '',
      result: '',
    },
    status: getStatus(record),
    sub_programme_name: record.programme || '',
    success_story: '',
    themes: getThemes(record),
    third_parties: getThirdParties(record),
    timeframe: {
      from: formatDate(getStartDate(record)),
      from_precision: 'day',
      to: formatDate(getEndDate(record)),
      to_precision: 'day',
    },
    title: getProjectTitle(record),
    type: [],
  };
};
