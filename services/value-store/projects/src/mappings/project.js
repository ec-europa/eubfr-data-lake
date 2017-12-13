module.exports = {
  project: {
    properties: {
      budget: {
        properties: {
          funding_area: {
            type: 'keyword',
          },
        },
      },
      computed_key: {
        type: 'keyword',
      },
      coordinators: {
        properties: {
          country: {
            type: 'keyword',
          },
        },
      },
      ec_priorities: {
        type: 'keyword',
      },
      producer_id: {
        type: 'keyword',
      },
      programme_name: {
        type: 'keyword',
      },
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
