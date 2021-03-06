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

export type GeoJSON =
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
export type BudgetItem = {
  currency: string,
  raw: string,
  value: number,
  _original?: {
    currency: string,
    raw: string,
    value: number,
  },
};

/**
 * Describes field `project.budget`.
 * @type {Budget}
 */
export type Budget = {
  eu_contrib: BudgetItem,
  funding_area: Array<string>,
  mmf_heading: string,
  other_contrib: BudgetItem,
  private_fund: BudgetItem,
  public_fund: BudgetItem,
  total_cost: BudgetItem,
};

/**
 * Describes field `project.third_parties`.
 * @type {ThirdParty}
 */
export type ThirdParty = {
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
export type Coordinates = {
  lat: number,
  lon: number,
};

/**
 * Describes field `project.project_locations.nuts`.
 * @type {Nuts}
 */
export type Nuts = {
  code: string,
  name: string,
  level: number | null,
  year: number | null,
};

/**
 * Describes field `project.project_locations`.
 * @type {Location}
 */
export type Location = {
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
 * Describes meta data of a media file
 * @see {@link http://schema.org/MediaObject|MediaObject}
 * @type {MediaFileMeta}
 */
export type MediaFileMeta = {
  description: string,
  mime_type: string,
  type: string,
};

/**
 * Describes field `project.media`.
 * Answers for what is where
 * @type {Media}
 */
export type Media = {
  meta: MediaFileMeta,
  name: string,
  url: string,
};

/**
 * Describes field `project.related_links`.
 * @type {RelatedLink}
 */
export type RelatedLink = {
  label: string,
  url: string,
};

/**
 * Describes field `project.results`.
 * @type {Result}
 */
export type Result = {
  available: string,
  result: string,
};

/**
 * Describes possible string values of a timeframe precision.
 * Can be one of 'year', 'month' or 'day'
 * @type {TimePrecision}
 */
export type TimePrecision = 'year' | 'month' | 'day';

/**
 * Describes field `project.timeframe`.
 * @type {Timeframe}
 */
export type Timeframe = {
  from: string | null,
  from_precision: TimePrecision,
  to: string | null,
  to_precision: TimePrecision,
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
  media: Array<Media>,
  programme_name: string,
  project_id: string,
  project_locations: Array<Location>,
  project_website: string,
  complete: boolean,
  related_links: Array<RelatedLink>,
  reporting_organisation: string,
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
