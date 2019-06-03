// @flow

import sanitizeBudgetItem from '@eubfr/lib/budget/budgetFormatter';
import type { Project } from '@eubfr/types';

/**
 * Preprocess `budget`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Total eligible expenditure allocated to the operation / Montant total éligible attribué au projet`
 * - `Union co-financing rate as per priority axes / Taux de cofinancement de l'UE selon le statut du bénéficiaire`
 *
 * @memberof 2014tc16rfir001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Budget}
 */

const getBudget = record => {
  let total = 0;
  let euContrib = 0;

  const totalCosts = record[
    'Total eligible expenditure allocated to the operation / Montant total éligible attribué au projet'
  ].split(';');

  totalCosts.forEach(cost => (total += Number(cost))); // eslint-disable-line

  record[
    "Union co-financing rate as per priority axes / Taux de cofinancement de l'UE selon le statut du bénéficiaire"
  ]
    .split(';')
    .forEach((percentage, key) => (euContrib += totalCosts[key] * percentage)); // eslint-disable-line

  return {
    total_cost: sanitizeBudgetItem({
      value: total,
      currency: 'EUR',
      raw:
        record[
          'Total eligible expenditure allocated to the operation / Montant total éligible attribué au projet'
        ],
    }),
    eu_contrib: sanitizeBudgetItem({
      value: euContrib,
      currency: 'EUR',
      raw:
        record[
          "Union co-financing rate as per priority axes / Taux de cofinancement de l'UE selon le statut du bénéficiaire"
        ],
    }),
    private_fund: sanitizeBudgetItem(),
    public_fund: sanitizeBudgetItem(),
    other_contrib: sanitizeBudgetItem(),
    funding_area: [],
    mmf_heading: '',
  };
};

/**
 * Preprocess `description`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Approved / Approuvé`
 * - `Operation summary / Résumé du projet`
 * - `Date of last update / Date de dernière mise à jour`
 *
 * @memberof 2014tc16rfir001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getDescription = record => {
  let description = '';

  const fields = [
    'Approved / Approuvé',
    'Operation summary / Résumé du projet',
    'Date of last update / Date de dernière mise à jour',
  ];

  fields.forEach(field => {
    description += `${field}: ${record[field]}\n`;
  });

  return description;
};

/**
 * Preprocess `ec_priorities`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Name of category of intervention / Nom de la catégorie d'intervention`
 *
 * @memberof 2014tc16rfir001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<String>}
 */

const getPriorities = record =>
  record[
    "Name of category of intervention / Nom de la catégorie d'intervention"
  ]
    ? record[
        "Name of category of intervention / Nom de la catégorie d'intervention"
      ]
        .split(';')
        .filter(a => a)
        .map(a => a.trim())
        .map(a => a.replace(/(\r\n|\n|\r)/gm, ''))
        .map(a => a.replace(/ {1,}/g, ' '))
    : [];

/**
 * Preprocess `project_id`.
 *
 * Input fields taken from the `record` are:
 * - `Index / Indice`
 *
 * @memberof 2014tc16rfir001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getProjectId = record => record['Index / Indice'];

/**
 * Preprocess `project_locations`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Country / Pays`
 * - `Operation post code / Code postal`
 *
 * @memberof 2014tc16rfir001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<Location>}
 */

const getLocations = record => {
  const locations = [];

  const countries = record['Country / Pays']
    .split(';')
    .filter(c => c)
    .map(c => c.trim());

  const postCodes = record['Operation post code / Code postal']
    .split(';')
    .filter(p => p)
    .map(p => p.trim());

  if (countries.length) {
    countries.forEach((code, key) => {
      // In project locations we care about unique locations in terms of country codes.
      const existing = locations.find(
        location => location.country_code === code
      );

      if (!existing) {
        locations.push({
          address: '',
          centroid: null,
          country_code: code,
          location: null,
          nuts: [],
          postal_code: postCodes[key] || '',
          region: '',
          town: '',
        });
      }
    });
  }

  return locations;
};

/**
 * Preprocess `third_parties`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Beneficiary name / Nom du bénéficiaire`
 * - `Country / Pays`
 *
 * @memberof 2014tc16rfir001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array<ThirdParty>}
 */

const getThirdParties = record => {
  const thirdParties = [];

  const actors = record['Beneficiary name / Nom du bénéficiaire']
    ? record['Beneficiary name / Nom du bénéficiaire']
        .split(';')
        .filter(a => a)
        .map(a => a.trim())
    : [];

  const countries = record['Country / Pays']
    .split(';')
    .filter(c => c)
    .map(c => c.trim());

  if (actors.length) {
    actors.forEach((name, key) => {
      thirdParties.push({
        address: '',
        country: countries[key],
        email: '',
        name,
        phone: '',
        region: '',
        role: '',
        type: '',
        website: '',
      });
    });
  }

  return thirdParties;
};

/**
 * Preprocess `timeframe`.
 *
 * Input fields taken from the `record` are:
 *
 * - `Operation start date / Date de début du projet`
 * - `Operation end date / Date de fin du projet`
 *
 * @memberof 2014tc16rfir001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {Timeframe}
 */

const getTimeframe = record => {
  const from = record['Operation start date / Date de début du projet'] || null;
  const to = record['Operation end date / Date de fin du projet'] || null;

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
 *
 * - `Operation name / Acronyme du projet`
 *
 * @memberof 2014tc16rfir001XlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */

const getTitle = record =>
  record['Operation name / Acronyme du projet']
    ? record['Operation name / Acronyme du projet'].trim()
    : '';

/**
 * Map fields for 2014tc16rfir001 producer, XLS file types
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014tc16rfir001/xls/test/stubs/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/2014tc16rfir001/xls/src/lib/transform.js|implementation details}
 *
 * @name 2014tc16rfir001XlsTransform
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
    ec_priorities: getPriorities(record),
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
    themes: [],
    third_parties: getThirdParties(record),
    timeframe: getTimeframe(record),
    title: getTitle(record),
    type: [],
  };
};
