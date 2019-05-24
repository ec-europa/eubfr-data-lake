/**
 * Adds a new property to {Project} accumulating results of the enrichment loop.
 * @param {Array<Project>} projects
 * @returns {Array<Object>} The original {Array<Project>} with a new property "enrichmentResults".
 */
const enrichmentDecorator = projects =>
  projects.map(project => {
    // Focus on potentially enriched fields.
    const { budget, project_locations } = project._source;
    const { eu_contrib, total_cost } = budget;

    // Different fields have different means of marking information as enriched.
    const hasEnrichedLocation = project_locations.find(l => l.enriched);
    const hasEnrichedEuContrib = eu_contrib._original;
    const hasEnrichedTotalCost = total_cost._original;

    if (hasEnrichedLocation || hasEnrichedEuContrib || hasEnrichedTotalCost) {
      return {
        enrichmentResults: {
          project_locations,
          budget,
        },
        ...project,
      };
    } else return project;
  });

export default enrichmentDecorator;
