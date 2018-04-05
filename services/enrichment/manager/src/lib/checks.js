export const canLocationsBeEnriched = locations =>
  locations &&
  locations.some(loc => {
    if (!loc) {
      return false;
    }

    // Centroid is empty but country code is provided
    const needsLocation = !loc.centroid && loc.country_code;
    if (needsLocation) return true;

    // Country code is empty but centroid is provided
    const needsCountryCode = !loc.country_code && loc.centroid;

    if (needsCountryCode) return true;

    return false;
  });

export const needsEnrichment = record =>
  record &&
  record.project_locations &&
  canLocationsBeEnriched(record.project_locations);
