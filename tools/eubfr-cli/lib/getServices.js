/**
 * List of all available services in the project.
 * Order IS important.
 */
const allServices = [
  { service: 'storage-signed-uploads', exportEnv: true },
  { service: 'storage-deleter', exportEnv: true },
  { service: 'ingestion-manager', exportEnv: false },
  { service: 'ingestion-cleaner', exportEnv: false },
  { service: 'ingestion-dead-letter-queue', exportEnv: false },
  { service: 'ingestion-quality-analyzer', exportEnv: false },
  { service: 'ingestion-etl-bulgaria-xls', exportEnv: false },
  { service: 'ingestion-etl-cordis-csv', exportEnv: false },
  { service: 'ingestion-etl-devco-xls', exportEnv: false },
  { service: 'ingestion-etl-eac-csv', exportEnv: false },
  { service: 'ingestion-etl-euinvest-csv', exportEnv: false },
  { service: 'ingestion-etl-euresults-csv', exportEnv: false },
  { service: 'ingestion-etl-fts-xls', exportEnv: false },
  { service: 'ingestion-etl-home-xls', exportEnv: false },
  { service: 'ingestion-etl-iati-csv', exportEnv: false },
  { service: 'ingestion-etl-inforegio-json', exportEnv: false },
  { service: 'ingestion-etl-inforegio-xml', exportEnv: false },
  { service: 'ingestion-etl-wifi4eu-xls', exportEnv: false },
  { service: 'value-store-projects', exportEnv: false },
  { service: 'logger-listener', exportEnv: false },
  { service: 'enrichment-manager', exportEnv: false },
  { service: 'enrichment-saver', exportEnv: false },
  { service: 'enrichment-fields-budget', exportEnv: false },
  { service: 'enrichment-fields-locations', exportEnv: false },
];

module.exports.services = allServices;

/**
 * Returns a list of services available in EUBFR project.
 * Give an empty array to get all available services in the project.
 *
 * @param {Array} services List of service names, such as `enrichment-saver`.
 * @returns {Array} List of services available, filtered by the parameter or all when empty.
 */
module.exports = services => {
  const selectedServices = [];

  if (services.length !== 0) {
    // Search and accumulate actual service and meta data for a given service name.
    services.forEach(serviceName => {
      const match = allServices.find(s => s.service === serviceName);
      // If there is a match, keep it.
      if (match.service) {
        selectedServices.push(match);
      }
    });
  }
  // If the list of `services` is empty, this means we give it all away.
  else {
    selectedServices.push(...allServices);
  }

  return selectedServices;
};
