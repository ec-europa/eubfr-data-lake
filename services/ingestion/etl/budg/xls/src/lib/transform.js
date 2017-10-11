/*
 * Transform message
 */

/*
 * Map fields
 */
export default record => {
  // Preprocess results
  const resultObject = {
    available: record['Results Available'],
    result: record['Results Platform Project Card'],
  };

  // Preprocess locations
  const locationArray = record['Participating countries']
    .split(',')
    .map((country, index) => ({
      name: country,
      geolocation: {
        lat: null,
        long: null,
      },
    }));

  // Preprocess type
  const typeArray =
    (record['Activity type'] != null && record['Activity type'].split(','))
    || null;

  // Preprocess coordinators
  const coordArray = [{
    name: record["Coordinator's name"],
    type: record['Coordinator organisation type'],
    address: record["Coordinator's address"],
    region: record["Coordinator's region"],
    country: record["Coordinator's country"],
    website: record["Coordinator's website"],
  }];

  // Preprocess partners
  const partnerArray = [];
  for (let i = 1; i < 39; i++) {
    if (record['Partner ' + i + ' name'] != null) {
      partnerArray.push({
        name: record['Partner ' + i + ' name'],
        type: record['Partner ' + i + ' organisation type'],
        address: record['Partner ' + i + ' address'],
        region: record['Partner ' + i + ' region'],
        country: record['Partner ' + i + ' country'],
        website: record['Partner ' + i + ' website'],
      })
    }
  }

  // Map the fields
  return {
    project_id: record['Project Number'],
    programme_name: record['Programme'],
    sub_programme_name: record['Sub-programme'],
    status: record['Project Status'],
    action: record['Action'],
    type: typeArray,
    call_year: record['Call year'],
    timeframe: {
      from: record['Start date'],
      to: record['End date'],
    },
    success_story: record['Is Success Story'],
    title: record['Project Title'],
    description: record['Project Summary'],
    eu_budget_contribution: Number(record["EU Grant award in euros (This amount represents the grant awarded after the selection stage and is indicative. Please note that any changes made during or after the project's lifetime will not be reflected here.)"]),
    project_website: record['Project Website'],
    results: resultObject,
    project_locations: locationArray,
    coordinators: coordArray,
    partners: partnerArray,
  };
};
