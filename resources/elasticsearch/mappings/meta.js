// Specific syntax:
// https://serverless.com/framework/docs/providers/aws/guide/variables/#reference-variables-in-javascript-files

module.exports = () => ({
  mappings: {
    file: {
      properties: {
        computed_key: { type: 'keyword' },
        content_length: { type: 'long' },
        content_type: { type: 'keyword' },
        last_modified: { type: 'date' },
        metadata: { type: 'object' },
        original_key: { type: 'keyword' },
        producer_arn: { type: 'keyword' },
        producer_id: { type: 'keyword' },
      },
    },
  },
});
