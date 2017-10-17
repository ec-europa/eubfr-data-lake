/*
 * Transform message (BUDGCSV)
 */

/*
 * Map fields
 */
export default record => {
  // Preprocess timeframe
  let timeframeFrom = null;
  let timeframeTo = null;

  if (record['Timeframe start'].indexOf(' to ') !== -1) {
    const timeframe = (record['Timeframe start'] || '').split(' to ');

    if (Array.isArray(timeframe) && timeframe.length === 2) {
      [timeframeFrom, timeframeTo] = timeframe;
    }
  } else {
    timeframeFrom = record['Timeframe start'];
    timeframeTo = record['Timeframe end'];
  }

  // Preprocess related links
  const links = (record['Related links'] || '')
    .split(';')
    .map(link => {
      const matches = link.match(/<a .*href="(.*)".*>(.*)<\/a>/i);

      if (Array.isArray(matches) && matches.length === 3) {
        return {
          url: matches[1],
          label: matches[2],
        };
      }

      return null;
    })
    .filter(link => link !== null);

  // Preprocess project locations
  const latArray = record['Project location latitude'].split(';');
  const longArray = record['Project location longitude'].split(';');
  const projectLocations = record['Project country(ies)']
    .split(';')
    .map((country, index) => ({
      name: country,
      geolocation: {
        lat: (Array.isArray(latArray) && latArray[index]) || null,
        long: (Array.isArray(longArray) && longArray[index]) || null,
      },
    }));

  // Preprocess coordinators
  const coordArray = record.Coordinators.split(';').map(coordinator => ({
    name: coordinator,
    type: null,
    address: null,
    region: null,
    country: null,
    website: null,
  }));

  // Preprocess partners
  const partnerArray = record.Coordinators.split(';').map(partner => ({
    name: partner,
    type: null,
    address: null,
    region: null,
    country: null,
    website: null,
  }));

  // Preprocess results
  const resultObject = {
    available: null,
    result: record.Results,
  };

  // Map the fields
  return {
    project_id: record.Nid,
    title: record.Name,
    cover_image: record.Visual,
    programme_name: record['Programme name'],
    description: record['Project description'],
    results: resultObject,
    ec_priorities: record['EC’s priorities'].split(';'),
    coordinators: coordArray,
    eu_budget_contribution: Number(record['EU Budget contribution']),
    partners: partnerArray,
    project_locations: projectLocations,
    timeframe: {
      from:
        timeframeFrom &&
        new Date(parseInt(timeframeFrom, 10) * 1000).toISOString(),
      to:
        timeframeTo && new Date(parseInt(timeframeTo, 10) * 1000).toISOString(),
    },
    project_website: record['Project webpage'],
    related_links: links,
  };
};
