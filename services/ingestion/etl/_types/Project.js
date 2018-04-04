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
 * Describes field `project.budget.eu_contrib`.
 * @type {BudgetItem}
 */
type BudgetItem = {
  currency: string,
  raw: string,
  value: number,
};

/**
 * Describes field `project.budget`.
 * @type {Budget}
 */
type Budget = {
  eu_contrib: BudgetItem,
  funding_area: Array<string>,
  mmf_heading: string,
  other_contrib: BudgetItem,
  private_fund: BudgetItem,
  public_fund: BudgetItem,
  total_cost: BudgetItem,
};

/**
 * Describes field `project.third_party`.
 * @type {ThirdParty}
 */
type ThirdParty = {
  address: string,
  country: string,
  email: string,
  name: string,
  phone: string,
  region: string,
  role: string,
  type: string,
  website: string,
};

/**
 * Describes field `project.project_locations.centroid`.
 * @type {Coordinates}
 */
type Coordinates = {
  lat: number,
  lon: number,
};

/**
 * Describes field `project.project_locations.nuts`.
 * @type {Nuts}
 */
type Nuts = {
  code: string,
  name: string,
  level: number,
  year: number,
};

/**
 * Describes field `project.project_locations`.
 * @type {Location}
 */
type Location = {
  address: string,
  centroid: Coordinates | null,
  country_code: string,
  // If nothing else, provide null in transform function for this field.
  // Never null project_locations field which is typed on ES level.
  location: GeoJSON | null,
  nuts: Array<Nuts> | null,
  postal_code: string,
  region: string,
  town: string,
};

/**
 * Describes field `project.media`.
 * @type {Media}
 */
type Media = {
  cover_image: string,
  video: string,
};

/**
 * Describes field `project.related_links`.
 * @type {RelatedLink}
 */
type RelatedLink = {
  label: string,
  url: string,
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
  description: string,
  ec_priorities: Array<string>,
  media: Media,
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
  third_parties: Array<ThirdParty>,
  timeframe: Timeframe,
  title: string,
  type: Array<string>,
};
