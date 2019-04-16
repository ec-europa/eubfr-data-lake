// @flow
import crypto from 'crypto';
import type { Project } from '@eubfr/types';
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
  funding_area: [],
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

  desc.Acronym = record['Project acronym/Acronimo del progetto'] || '';
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
  record['Project Number/Codice del progetto']
    ? crypto
        .createHash('md5')
        .update(String(record['Project Number/Codice del progetto']))
        .digest('hex')
    : '';

/**
 * Preprocess `project_locations`.
 *
 * Input fields taken from the `record` are:
 * - `Participating Countries/Paesi partecipanti`
 * - `LP COUNTRY/Paese del LP`
 *
 * @memberof 2014tc16m4tn002XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<Location>}
 */

const getLocations = record => {
  const locations = [];

  const countries = record['Participating Countries/Paesi partecipanti'].split(
    ','
  );

  const countryLeader = record['LP COUNTRY/Paese del LP'] || '';

  // As we work only with country codes and there's no additional information, add it only if it's not present yet.
  if (!countries.includes(countryLeader)) {
    countries.push(countryLeader);
  }

  countries
    .filter(c => c)
    .forEach(countryCode => {
      locations.push({
        address: '',
        centroid: null,
        country_code: countryCode,
        location: null,
        nuts: [],
        postal_code: '',
        region: '',
        town: '',
      });
    });

  return locations;
};

/**
 * Preprocess `themes`.
 *
 * Input fields taken from the `record` are:
 * - `Intervention category/Categoria dell' operazione`
 *
 * @memberof 2014tc16m4tn002XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<String>}
 */

const getThemes = record => {
  const themes = [];

  if (record["Intervention category/Categoria dell' operazione"]) {
    themes.push(
      record["Intervention category/Categoria dell' operazione"]
        .trim()
        .replace(/(\r\n|\n|\r)/gm, ' ')
        .replace(/ {1,}/g, ' ')
    );
  }

  return themes;
};

/**
 * Preprocess `third_parties`.
 *
 * Input fields taken from the `record` are:
 * - `LEAD PARTNER/ Nome del Capofila`
 * - `LP COUNTRY/Paese del LP`
 *
 * @memberof 2014tc16m4tn002XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<ThirdParty>}
 */

const getThirdParties = record => {
  const thirdParties = [];
  const name = record['LEAD PARTNER/ Nome del Capofila']
    ? record['LEAD PARTNER/ Nome del Capofila'].trim()
    : '';
  const country = record['LP COUNTRY/Paese del LP'];

  if (name || country) {
    thirdParties.push({
      address: '',
      country,
      email: '',
      name,
      phone: '',
      region: '',
      role: 'coordinator',
      type: '',
      website: '',
    });
  }

  return thirdParties;
};

/**
 * Preprocess `third_parties`.
 *
 * Input fields taken from the `record` are:
 * - `START DATE/Data di inizio`
 * - `END DATE/Data di fine`
 *
 * @memberof 2014tc16m4tn002XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Timeframe}
 */

const getTimeframe = record => {
  const from = record['START DATE/Data di inizio']
    ? new Date(record['START DATE/Data di inizio']).toISOString()
    : null;
  const to = record['END DATE/Data di fine']
    ? new Date(record['END DATE/Data di fine']).toISOString()
    : null;

  return {
    from,
    from_precision: 'day',
    to,
    to_precision: 'day',
  };
};

/**
 * Preprocess `title`.
 *
 * Input fields taken from the `record` are:
 * - `Title/Titolo`
 *
 * @memberof 2014tc16m4tn002XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getTitle = record =>
  record['Title/Titolo'] ? record['Title/Titolo'].trim() : '';

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
    programme_name: '',
    project_id: getProjectId(record),
    project_locations: getLocations(record),
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
    themes: getThemes(record),
    third_parties: getThirdParties(record),
    timeframe: getTimeframe(record),
    title: getTitle(record),
    type: [],
  };
};
