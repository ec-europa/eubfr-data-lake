/*
 * Transform message (REGIO JSON)
 */

// import type { Project } from '../../../../types/Project';

// Formats date from DD/MM/YYYY to ISO 8601 date format.
const formatDate = date => {
  const d = date.split(/\//);
  if (d.length !== 3) return null;
  return new Date(d[2], d[1] - 1, d[0]).toISOString();
};

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
    total_cost: Number(record.totalcost.substring(4).replace(/\s+/g, '')),
    eu_contrib: Number(record.eucontrib.substring(4).replace(/\s+/g, '')),
    private_fund: Number(record.privatefund.substring(4).replace(/\s+/g, '')),
    public_fund: Number(record.publicfund.substring(4).replace(/\s+/g, '')),
    other_contrib: Number(record.othercontrib.substring(4).replace(/\s+/g, '')),
    funding_area: record.related_fund,
  };

  // Preprocess coordinators
  const coordArray = [];
  for (let i = 0; i < record.contacts.length; i += 1) {
    coordArray.push({
      name: record.contacts[i].organization,
      type: record.contacts[i].contact_type,
      address: getAddress(record.contacts[i]),
      region: null,
      country: record.contacts[i].country,
      website: null,
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
    timeframe: {
      from: formatDate(record.start),
      to: formatDate(record.end),
    },
    source: record.source,
    themes: record.related_themes,
    project_website: getProjectWebsite(record),
    draft_date: formatDate(record.draftdate),
    programme_name: record.rel_program,
    description: record.subtitle,
    project_locations: locationArray,
  };
};
