// Specific syntax:
// https://serverless.com/framework/docs/providers/aws/guide/variables/#reference-variables-in-javascript-files

// We disable report field because structure is unpredictable
// Thus, it's not searchable https://www.elastic.co/guide/en/elasticsearch/reference/current/enabled.html

module.exports = () => ({
  mappings: {
    report: {
      properties: {
        meta: { type: 'object' },
        report: { type: 'object', enabled: false },
      },
    },
  },
});
