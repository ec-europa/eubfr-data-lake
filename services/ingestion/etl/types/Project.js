// @flow

/**
 *
 * Project model has been continously discussed in EUBFR-4 EUBFR-5 and EUBFR-70.
 *
 * Exported Project interface should ALWAYS have fields as required. When a producer
 * does not provide data for a field, provide null or '' from transform function.
 *
 * Note that this file describes types which are used during static code analysis.
 * This helps developers write consistend transform functions in ETLs.
 * This does not mean other layers are safe: elasticsearch, HTTP requests, etc.
 *
 * Following is a list of specifics which are here to interoperate with other layers.
 *
 * Dates:
 * Put default `null` when missing data. Elasticsearch will not accept empty string.
 * More: https://www.elastic.co/guide/en/elasticsearch/reference/6.0/date.html
 *
 * Geolocation:
 * Put default `null` when missing data. Elasticsearch has the notion of geo_shape.
 * More: https://www.elastic.co/guide/en/elasticsearch/reference/6.0/geo-shape.html
 */

// eslint-disable-next-line
import type {
  Point2D,
  MultiPoint2D,
  LineString2D,
  MultiLineString2D,
  Polygon2D,
  MultiPolygon2D,
} from 'flow-geojson';

type GeoJSON =
  | Point2D
  | MultiPoint2D
  | LineString2D
  | MultiLineString2D
  | Polygon2D
  | MultiPolygon2D;

type Budget = {
  eu_contrib: number,
  total_cost: number,
  private_fund: number,
  public_fund: number,
  other_contrib: number,
  funding_area: string,
};

type Coordinator = {
  name: string,
  type: string,
  address: string,
  region: string,
  country: string,
  website: string,
  phone: string,
  email: string,
};

type Location = {
  country_code: string,
  region: string,
  nuts2: string,
  address: string,
  postal_code: string,
  town: string,
  // If nothing else, provide null in transform function for this field.
  // Never null project_locations field which is typed on ES level.
  location: GeoJSON | null,
};

type Partner = {
  name: string,
  type: string,
  address: string,
  region: string,
  country: string,
  website?: string,
};

type RelatedLink = {
  url: string,
  label: string,
};

type Result = {
  available: string,
  result: string,
};

type Timeframe = {
  from: string | null,
  to: string | null,
};

export type Project = {
  action: string,
  budget: Budget,
  call_year: string,
  coordinators: Array<Coordinator>,
  cover_image: string,
  description: string,
  ec_priorities: Array<string>,
  partners: Array<Partner>,
  programme_name: string,
  project_id: string,
  project_locations: Array<Location>,
  project_website: string,
  related_links: Array<RelatedLink>,
  results: Result,
  status: string,
  sub_programme_name: string,
  success_story: string,
  themes: Array<string>,
  timeframe: Timeframe,
  title: string,
  type: Array<string>,
};
