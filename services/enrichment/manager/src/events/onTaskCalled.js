export const handler = (event, context, callback) => {
  /**
   * Enrichment logic starts here
   */

  console.log('Task', event);
  callback(null, event);
};

export default handler;
