// @flow

import sanitizeBudgetItem from '@eubfr/lib/budgetFormatter';
import getCountryCode from '@eubfr/lib/getCountryCode';
import type { Project } from '@eubfr/types';

/**
 * Preprocess budget funding_area field
 *
 * Input fields taken from the `record` are:
 *
 * - `Project Call Id`
 *
 * @memberof HomeXlsTransform
 * @param {Object} record The row received from harmonized storage
 * @returns {Array} List of string values for `funding_area` field
 */
const getFundingArea = record => {
  const fundingArea = [];

  const callParts = record['Project Call Id']
    ? record['Project Call Id'].split('-')
    : [];

  if (callParts.length > 0) {
    const abbreviation = callParts[0];

    switch (abbreviation) {
      case 'AMIF':
        fundingArea.push('Asylum, Migration and Integration Fund');
        break;

      case 'ISF':
        fundingArea.push('Internal Security Fund');
        break;

      default:
        break;
    }
  }

  return fundingArea;
};

/**
 * Preprocess budget field.
 *
 * Input fields taken from the `record` are:
 *
 * - `Project Requested EU Contrib`
 *
 * @memberof HomeXlsTransform
 * @param {Object} record The row received from harmonized storage
 * @returns {Budget}
 */
const getBudget = record => {
  const budgetObject = {
    total_cost: sanitizeBudgetItem(),
    eu_contrib: sanitizeBudgetItem({
      value: record['Project Requested EU Contrib'],
      currency: 'EUR',
      raw: record['Project Requested EU Contrib'],
    }),
    private_fund: sanitizeBudgetItem(),
    public_fund: sanitizeBudgetItem(),
    other_contrib: sanitizeBudgetItem(),
    funding_area: getFundingArea(record),
    mmf_heading: '',
  };

  return budgetObject;
};

/**
 * Preprocess description
 *
 * Input fields taken from the `record` are:
 *
 * - `Project Abstract`
 * - `Project Acronym`
 * - `Project Duration`
 * - `Proposal Free Keywords Uppercase`
 *
 * @memberof HomeXlsTransform
 * @param {Object} record Piece of data to transform before going to harmonized storage.
 * @returns {ThirdParty}
 */
const getDescription = record => {
  const fields = [
    'Project Acronym',
    'Project Duration',
    'Proposal Free Keywords Uppercase',
    'Project Acronym',
  ];

  const description = {};

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
 * Preprocess programme_name field
 *
 * Input fields taken from the `record` are:
 *
 * - `Project Call Id`
 *
 * @memberof HomeXlsTransform
 * @param {Object} record Piece of data to transform before going to harmonized storage.
 * @returns {ThirdParty}
 */
const getProgrammeName = record => {
  let abbreviation = '';

  const callParts = record['Project Call Id']
    ? record['Project Call Id'].split('-')
    : [];

  if (callParts.length > 0) {
    abbreviation = callParts[0]; // eslint-disable-line prefer-destructuring
  }

  return abbreviation;
};

/**
 * Formats the third_parties
 *
 * Input fields taken from the `record` are:
 *
 * - `Participant Legal Name`
 * - `Participant Role`
 * - `Participant LE Country Code`
 * - `Project PCOCO First Name`
 * - `Project PCOCO Last Name`
 * - `Project PCOCO Email`
 *
 * @memberof HomeXlsTransform
 * @param {Object} record Piece of data to transform before going to harmonized storage.
 * @returns {ThirdParty}
 */
const getThirdParties = record => {
  const actors = [];

  const roles = record['Participant Role'].split(';').filter(p => p);
  const countries = record['Participant LE Country Code']
    .split(';')
    .filter(c => c);

  if (roles) {
    roles.forEach((role, actorKey) => {
      // prepare the common structure for the third party object
      const actor = {
        address: '',
        country: countries[actorKey] ? getCountryCode(countries[actorKey]) : '',
        email: '',
        name: '',
        phone: '',
        region: '',
        role: '',
        type: '',
        website: '',
      };

      if (role === 'COORDINATOR') {
        actor.role = 'coordinator';
        actor.email = record['Project PCOCO Email'] || '';
        actor.name = `${record['Project PCOCO First Name']} ${
          record['Project PCOCO Last Name']
        }`;
      } else {
        actor.role = 'participant';
      }

      actors.push(actor);
    });
  }

  return actors;
};

/**
 * Format date
 *
 * @memberof HomeXlsTransform
 * @param {Date} date Date in "10/9/14" (MM/DD/YY) or "10/9/2014" (MM/DD/YYYY) format
 * @returns {Date} The date formatted into an ISO 8601 date format
 *
 * @example
 * input => "10/9/2014"
 * output => "2014-10-09T00:00:00.000Z"
 */
const formatDate = date => {
  if (!date || typeof date !== 'string') return null;
  const d = date.split(/\//);
  if (d.length !== 3) return null;
  // If year is given as 2 digits, make it 4 digits.
  if (d[2].length === 2) d[2] = `20${d[2]}`;
  const [month, day, year] = d;
  if (!day || !month || !year) return null;
  try {
    return new Date(Date.UTC(year, month - 1, day)).toISOString();
  } catch (e) {
    return null;
  }
};

/**
 * Map fields for HOME producer, XLS file types
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/home/xls/test/stubs/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/home/xls/src/lib/transform.js|implementation details}
 * @name HomeXlsTransform
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
    programme_name: getProgrammeName(record),
    project_id: record['Project Number'],
    project_locations: [],
    project_website: '',
    complete: true,
    related_links: [],
    reporting_organisation: 'HOME',
    results: {
      available: '',
      result: '',
    },
    status: record['Project Status'] || '',
    sub_programme_name: record['Project Call Id'] || '',
    success_story: '',
    themes: [],
    third_parties: getThirdParties(record),
    timeframe: {
      from: formatDate(record['Project Start Date']),
      from_precision: 'day',
      to: formatDate(record['Project End Date']),
      to_precision: 'day',
    },
    title: record['Project Title'],
    type: [],
  };
};
