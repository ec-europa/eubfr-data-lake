// @flow

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

/**
 * Describes field `project.budget`.
 * @type {Budget}
 */
type Budget = {
  eu_contrib: number,
  total_cost: number,
  private_fund: number,
  public_fund: number,
  other_contrib: number,
  funding_area: Array<string>,
};

/**
 * Describes field `project.coordinators`.
 * @type {Coordinator}
 */
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

/**
 * Describes field `project.project_locations`.
 * @type {Location}
 */
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

/**
 * Describes field `project.partners`.
 * @type {Partner}
 */
type Partner = {
  name: string,
  type: string,
  address: string,
  region: string,
  country: string,
  website?: string,
};

/**
 * Describes field `project.related_links`.
 * @type {RelatedLink}
 */
type RelatedLink = {
  url: string,
  label: string,
};

/**
 * Describes field `project.results`.
 * @type {Result}
 */
type Result = {
  available: string,
  result: string,
};

/**
 * Describes field `project.timeframe`.
 * @type {Timeframe}
 */
type Timeframe = {
  from: string | null,
  to: string | null,
};

/**
 * Describes `project`.
 * @type {Project}
 */
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
