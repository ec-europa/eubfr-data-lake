import uuid from 'uuid';

export default record => {
  const normalizedObject = {
    id: {
      S: uuid.v1(),
    },
    source: {
      S: record.source || 'undefined',
    },
    title: {
      S: record.title || 'undefined',
    },
    programme_name: {
      S: record.programme_name || 'unedfined',
    },
    description: {
      S: record.description || 'undefined',
    },
    results: {
      S: record.results || 'undefined',
    },
    ec_priorities: {
      SS: record.ec_priorities
        .map(item => item.trim())
        .filter(item => item !== '') || ['undefined'],
    },
    coordinators: {
      SS: record.coordinators
        .map(item => item.trim())
        .filter(item => item !== '') || ['undefined'],
    },
    eu_budget_contribution: {
      N: (record.eu_budget_contribution || 0).toString(),
    },
    partners: {
      SS: record.partners
        .map(item => item.trim())
        .filter(item => item !== '') || ['undefined'],
    },
    timeframe: {
      M: {
        from: { S: record.timeframe.from || 'undefined' },
        to: { S: record.timeframe.to || 'undefined' },
      },
    },
  };

  if (
    Array.isArray(record.project_locations) &&
    record.project_locations.length > 0
  ) {
    normalizedObject.project_locations = {
      L: record.project_locations.map(location => ({
        M: {
          name: { S: location.name || 'undefined' },
          geolocation: {
            M: {
              lat: { S: location.geolocation.lat || 'undefined' },
              long: { S: location.geolocation.long || 'undefined' },
            },
          },
        },
      })),
    };
  }

  return normalizedObject;
};
