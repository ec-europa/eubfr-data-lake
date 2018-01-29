// Specific syntax:
// https://serverless.com/framework/docs/providers/aws/guide/variables/#reference-variables-in-javascript-files

module.exports = () => ({
  file: {
    properties: {
      producer_id: { type: 'keyword' },
      computed_key: { type: 'keyword' },
      original_key: { type: 'keyword' },
      producer_arn: { type: 'keyword' },
      content_type: { type: 'keyword' },
      last_modified: { type: 'date' },
      content_length: { type: 'long' },
      // metadata: otherMeta,
    },
  },
});
