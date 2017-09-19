import uuid from 'uuid';

const normalizeString = source =>
  source && typeof source === 'string' && source.trim().length > 0
    ? {
        S: source.trim(),
      }
    : null;

const normalizeNumber = source => ({
  N: (parseInt(source, 10) || 0).toString(),
});

const normalizeStringSet = source => {
  if (Array.isArray(source) && source.length > 0) {
    const normalizedSource = source
      .map(item => item.trim())
      .filter(item => item !== '');

    if (normalizedSource.length > 0) {
      return {
        SS: normalizedSource,
      };
    }
  }

  return null;
};

export default record => {
  const normalizedObject = {
    id: {
      S: uuid.v1(),
    },
    source: normalizeString(record.source),
    title: normalizeString(record.title),
    programme_name: normalizeString(record.programme_name),
    description: normalizeString(record.description),
    results: normalizeString(record.results),
    ec_priorities: normalizeStringSet(record.ec_priorities),
    coordinators: normalizeStringSet(record.coordinators),
    partners: normalizeStringSet(record.partners),
    eu_budget_contribution: normalizeNumber(record.eu_budget_contribution),
    timeframe: {
      M: {
        from: normalizeString(record.timeframe && record.timeframe.from),
        to: normalizeString(record.timeframe && record.timeframe.to),
      },
    },
  };

  // Project locations
  if (
    Array.isArray(record.project_locations) &&
    record.project_locations.length > 0
  ) {
    normalizedObject.project_locations = {
      L: record.project_locations.map(location => ({
        M: {
          name: normalizeString(location.name),
          geolocation: {
            M: {
              lat: normalizeString(
                location.geolocation && location.geolocation.lat
              ),
              long: normalizeString(
                location.geolocation && location.geolocation.long
              ),
            },
          },
        },
      })),
    };
  }

  return normalizedObject;
};
