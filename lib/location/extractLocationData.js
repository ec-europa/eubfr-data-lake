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

  // Information about towns and regions are separated in several ways.
  const separator = new RegExp(/\s*(?:\band\b|;|,|\\|\/)\s*/i);
  // There are some known words included in the data which are useless.
  const ignoreWords = new RegExp(
    /(department|school|site|region|department|oversea)/gi
  );

  // Blueprint for the return structure.
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

    // If there's more information in addition to the country, use it.
    if (infoArray.length) {
      // Given there are 1 or 2 items, we can extract town and region.
      if (infoArray.length < 3) {
        // We require specificity from left to right.
        const [town, region] = infoArray;
        if (town) results.towns.push(town);
        if (region) results.regions.push(region);
      }
      // Otherwise assume a list of regions.
      else {
        infoArray.forEach(infoItem => {
          // Ignore items which contain useless info, i.e. schools, sites, oversears, etc.
          if (!infoItem.match(ignoreWords)) {
            results.regions.push(infoItem);
          }
        });
      }
    }
  });

  return results;
};

module.exports = extractLocationData;
