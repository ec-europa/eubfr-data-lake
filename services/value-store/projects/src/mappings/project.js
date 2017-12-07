module.exports = {
  project: {
    properties: {
      project_locations: {
        properties: {
          location: {
            type: 'geo_point',
            ignore_malformed: true,
          },
        },
      },
      timeframe: {
        properties: {
          from: {
            type: 'date',
          },
          to: {
            type: 'date',
          },
        },
      },
    },
  },
};
