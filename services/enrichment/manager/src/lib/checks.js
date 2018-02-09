export const canLocationsBeEnriched = locations =>
  locations &&
  locations.some(loc => {
    if (!loc) {
      return false;
    }

    // Country code is provided but location is empty
    const needsLocation = loc.country_code && !loc.location;
    if (needsLocation) return true;

    // Location is provided but country code is empty
    const needsCountryCode =
      !loc.country_code &&
      loc.location &&
      loc.location.type === 'Point' &&
      loc.location.coordinates;

    if (needsCountryCode) return true;

    return false;
  });

export const needsEnrichment = record =>
  record &&
  record.project_locations &&
  canLocationsBeEnriched(record.project_locations);

export const alreadyEnriched = (newRecord, existingRecord) => false;
