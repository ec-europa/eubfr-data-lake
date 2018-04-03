export const canLocationsBeEnriched = locations =>
  locations &&
  locations.some(loc => {
    if (!loc) {
      return false;
    }

    // Centroid is empty but country code is provided OR
    // Country code is empty but centroid is provided OR
    // there are no NUTS code provided
    return (
      (!loc.centroid && loc.country_code) ||
      (loc.centroid && !loc.country_code) ||
      !loc.nuts.length
    );
  });

export const needsEnrichment = record =>
  record &&
  record.project_locations &&
  canLocationsBeEnriched(record.project_locations);
