/*
 * Transform message (REGIO JSON)
 */

const getNumber = str => str.substring(4).replace(/\s+/g, '');
const hasEuroPrefix = str => (str.includes('EUR') ? str : '');
const getAddress = contact => {
  if (contact.address && contact.city) {
    return `${contact.address}, ${contact.city}`;
  } else if (contact.address) {
    return `${contact.address}`;
  }
  return '';
};

const getProjectWebsite = record => {
  if (record.url && typeof record.url === 'object') {
    return record.url[0];
  } else if (record.url && typeof record.url === 'string') {
    return record.url;
  }
  return '';
};

/*
 * Map fields
 */
export default record => {
  // Preprocess budget
  const budgetObject = {
    total_cost: Number(getNumber(hasEuroPrefix(record.totalcost))),
    eu_contrib: Number(getNumber(hasEuroPrefix(record.eucontrib))),
    private_fund: Number(getNumber(hasEuroPrefix(record.privatefund))),
    public_fund: Number(getNumber(hasEuroPrefix(record.publicfund))),
    other_contrib: Number(getNumber(hasEuroPrefix(record.othercontrib))),
    funding_area: record.related_fund,
  };

  // Preprocess coordinators
  const coordArray = [];
  for (let i = 0; i < record.contacts.length; i += 1) {
    coordArray.push({
      name: record.contacts[i].organization,
      type: record.contacts[i].contact_type,
      address: getAddress(record.contacts[i]),
      region: record.contacts[i].region ? record.contacts[i].region : null,
      country: record.contacts[i].country,
      website: record.contacts[i].website ? record.contacts[i].website : null,
      phone: record.contacts[i].phone,
      email: record.contacts[i].email,
    });
  }

  // Preprocess related countries
  const locationArray = [];
  for (let i = 0; i < record.related_countries.length; i += 1) {
    locationArray.push({
      country_name: record.related_countries[i].name,
      country_code: record.related_countries[i].code,
      // Provide 0 as number by default, because of current Elasticsearch store.
      location: {
        lat: 0,
        lon: 0,
      },
    });
  }

  // Map the fields
  return {
    project_id: record.id.toString(),
    title: record.title,
    budget: budgetObject,
    coordinators: coordArray,
    period: record.period,
    // Todo
    timeframe: {
      from: record.start && new Date(record.start).toISOString(),
      to: record.end && new Date(record.end).toISOString(),
    },
    source: record.source,
    themes: record.related_themes,
    draft_date: record.draftdate && new Date(record.draftdate).toISOString(),
    programme_name: record.rel_program,
    description: record.subtitle,
    project_locations: locationArray,
    project_website: getProjectWebsite(record),
  };
};
