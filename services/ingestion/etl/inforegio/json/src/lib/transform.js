/*
 * Transform message (REGIO JSON)
 */

/*
 * Map fields
 */
export default record => {
  // Preprocess budget
  const budgetObject = {
    total_cost: Number(record.totalcost.substring(4).replace(/\s+/g, '')),
    eu_contrib: Number(record.eucontrib.substring(4).replace(/\s+/g, '')),
    private_fund: Number(record.privatefund.substring(4).replace(/\s+/g, '')),
    public_fund: Number(record.publicfund.substring(4).replace(/\s+/g, '')),
    other_contrib: Number(record.othercontrib.substring(4).replace(/\s+/g, '')),
  };

  // Preprocess coordinators
  const coordArray = [];
  for (let i = 0; i < record.contacts.length; i += 1) {
    coordArray.push({
      name: record.contacts[i].organization,
      type: record.contacts[i].contact_type,
      address: `${record.contacts[i].address}, ${record.contacts[i].city}`,
      region: null,
      country: record.contacts[i].country,
      website: null,
      phone: record.contacts[i].phone,
      email: record.contacts[i].email,
    });
  }

  // Preprocess related countries
  const countriesArray = [];
  for (let i = 0; i < record.related_countries.length; i += 1) {
    countriesArray.push({
      country_name: record.related_countries[i].name,
      country_code: record.related_countries[i].code,
      geolocation: {
        lat: null,
        lon: null,
      },
    });
  }

  // Map the fields
  return {
    project_id: record.id.toString(),
    sid: record.sid.toString(),
    title: record.title,
    technical_data: record.technicaldata,
    cci: record.cci,
    budget: budgetObject,
    coordinators: coordArray,
    period: record.period,
    timeframe: {
      from: record.start,
      to: record.end,
    },
    source: record.source,
    themes: record.related_themes,
    project_website: record.url,
    draft_date: record.draftdate,
    related_fund: record.related_fund,
    programme_name: record.rel_program,
    subtitle: record.subtitle,
  };
};
