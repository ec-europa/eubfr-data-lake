// Specific syntax:
// https://serverless.com/framework/docs/providers/aws/guide/variables/#reference-variables-in-javascript-files

module.exports = () => ({
  mappings: {
    report: {
      properties: {
        meta: { type: 'object' },
        report: { type: 'object' },
      },
    },
  },
});
