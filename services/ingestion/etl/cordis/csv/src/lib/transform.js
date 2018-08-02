// @flow

import sanitizeBudgetItem from '@eubfr/lib/budgetFormatter';
import getCountryCode from '@eubfr/lib/getCountryCode';
import type { Project } from '@eubfr/types';

/*
 * Transform message (CORDIS CSV)
 */

/**
 * Preprocess `funding_area`
 * Input fields taken from the `record` are:
 * - `fundingScheme`
 *
 * @memberof CordisCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array}
 */

const getFundingArea = record => [record.fundingScheme] || [];

/**
 * Preprocess budget
 *
 * @memberof CordisCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Budget}
 */
const getBudget = record => {
  let euContrib = {
    eu_contrib: sanitizeBudgetItem(),
  };

  const budget = {
    total_cost: sanitizeBudgetItem({
      value: record.totalCost,
      currency: 'EUR',
      raw: record.totalCost,
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
        value: record.ecMaxContribution,
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
 * - `acronym`
 * - `objective`
 * - `rcn`
 * - `topic`
 *
 * @memberof CordisCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getDescription = record => {
  const description = {};
  const fields = ['rcn', 'acronym', 'topics', 'objective'];

  fields.forEach(field => {
    if (record[field]) {
      description[field] = record[field];
    }
  });

  return Object.keys(description)
    .map(key => `${key}: ${description[key]}`)
    .join('\n');
};

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
 * @param {Date} date Date in `YYYY-MM-DD` (ISO) format
 * @returns {Date} The date formatted into an ISO 8601 date format
 *
 * @example
 * input => "2018-12-31"
 * output => "2018-12-31T00:00:00.000Z"
 */
const formatDate = date => {
  if (!date || typeof date !== 'string') return null;

  try {
    return new Date(date).toISOString();
  } catch (e) {
    return null;
  }
};

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

  // Preprocess third parties
  const thirdPartiesArray = getThirdParties(record);

  // Map the fields
  return {
    action: '',
    budget: getBudget(record),
    call_year: '',
    description: getDescription(record),
    ec_priorities: [],
    media: [],
    programme_name: record.frameworkProgramme || '',
    project_id: record.id || '',
    project_locations: getLocations(record),
    project_website: record.projectUrl || '',
    public: true,
    related_links: [],
    reporting_organisation: 'RTD',
    results: {
      available: '',
      result: '',
    },
    status: record.status || '',
    sub_programme_name: record.programme || '',
    success_story: '',
    themes: [],
    third_parties: thirdPartiesArray,
    timeframe: {
      from: formatDate(record.startDate),
      from_precision: 'day',
      to: formatDate(record.endDate),
      to_precision: 'day',
    },
    title: record.title || '',
    type: [],
  };
};
