// Specific syntax:
// https://serverless.com/framework/docs/providers/aws/guide/variables/#reference-variables-in-javascript-files

module.exports = () => ({
  project: {
    properties: {
      title: {
        type: 'text',
        fields: {
          keyword: {
            type: 'keyword',
          },
        },
      },
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
            type: 'geo_shape',
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
});
