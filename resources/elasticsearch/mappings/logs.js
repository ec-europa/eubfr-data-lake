// Specific syntax:
// https://serverless.com/framework/docs/providers/aws/guide/variables/#reference-variables-in-javascript-files

module.exports = () => ({
  mappings: {
    file: {
      properties: {
        emitter: { type: 'keyword' },
        level: { type: 'keyword' },
        time: { type: 'date' },
        message: {
          type: 'nested',
          properties: {
            computed_key: { type: 'keyword' },
            status_message: { type: 'text' },
          },
        },
      },
    },
  },
});
