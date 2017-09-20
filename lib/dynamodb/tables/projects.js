import uuid from 'uuid';

import {
  normalizeList,
  normalizeMap,
  normalizeNumber,
  normalizeString,
  normalizeStringSet,
} from '../helpers/normalize';

export const normalizeProject = record => {
  const normalizedObject = {
    id: normalizeString(uuid.v1()),
    creation_date: normalizeString(record.creation_date),
    source: normalizeMap({
      producer: normalizeString(record.source && record.source.producer),
      object_key: normalizeString(record.source && record.source.object_key),
    }),
    title: normalizeString(record.title),
    cover_image: normalizeString(record.cover_image),
    programme_name: normalizeString(record.programme_name),
    description: normalizeString(record.description),
    results: normalizeString(record.results),
    ec_priorities: normalizeStringSet(record.ec_priorities),
    coordinators: normalizeStringSet(record.coordinators),
    eu_budget_contribution: normalizeNumber(record.eu_budget_contribution),
    partners: normalizeStringSet(record.partners),
    timeframe: normalizeMap({
      from: normalizeString(record.timeframe && record.timeframe.from),
      to: normalizeString(record.timeframe && record.timeframe.to),
    }),
    project_website: normalizeString(record.project_website),
  };

  // Project locations
  if (
    Array.isArray(record.project_locations) &&
    record.project_locations.length > 0
  ) {
    normalizedObject.project_locations = normalizeList(
      record.project_locations.map(location =>
        normalizeMap({
          name: normalizeString(location.name),
          geolocation: normalizeMap({
            lat: normalizeString(
              location.geolocation && location.geolocation.lat
            ),
            long: normalizeString(
              location.geolocation && location.geolocation.long
            ),
          }),
        })
      )
    );
  }

  // Related links
  if (Array.isArray(record.related_links) && record.related_links.length > 0) {
    normalizedObject.related_links = normalizeList(
      record.related_links.map(link =>
        normalizeMap({
          label: normalizeString(link.label),
          url: normalizeString(link.url),
        })
      )
    );
  }

  return normalizedObject;
};

export default normalizeProject;
