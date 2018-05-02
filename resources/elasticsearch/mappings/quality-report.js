// Specific syntax:
// https://serverless.com/framework/docs/providers/aws/guide/variables/#reference-variables-in-javascript-files

module.exports = () => ({
  mappings: {
    report: {
      properties: {
        computed_key: { type: 'keyword' },
        last_modified: { type: 'date' },
        report: { type: 'object' },
      },
    },
  },
});
