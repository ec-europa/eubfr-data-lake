/**
 * Extracts the following properties for `project_locations:
 * - `country_code`
 * - `region`
 * - `town`
 *
 * @param {String} input
 * @returns {Object} results
 */
const extractLocationData = input => {
  if (!input) return {};

  const separator = new RegExp(/[,/]/i); // separate either by comma or slash.

  const results = {
    countryCodes: [],
    regions: [],
    towns: [],
    raw: input,
  };

  const locations = input
    .split(';')
    .map(p => p.trim())
    .filter(l => l);

  locations.forEach(location => {
    const infoArray = location
      .split(separator)
      // Improve the separate pieces of information for each location.
      .map(i => i.trim())
      .filter(i => i);

    // Country code is always the last item.
    const code = infoArray.pop();
    results.countryCodes.push(code);

    if (infoArray.length) {
      const [town, region] = infoArray;

      if (town) results.towns.push(town);
      if (region) results.regions.push(region);
    }
  });

  return results;
};

module.exports = extractLocationData;
