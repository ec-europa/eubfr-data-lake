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

// Project model is discussed in EUBFR-4 EUBFR-5 and EUBFR-70

type Result = {
  available?: string,
  result: string,
};

type GeoJSON =
  | Point2D
  | MultiPoint2D
  | LineString2D
  | MultiLineString2D
  | Polygon2D
  | MultiPolygon2D;

type Location = {
  country_code: string,
  region?: string,
  nuts2?: string,
  address?: string,
  postal_code?: string,
  town?: string,
  location: GeoJSON,
};

type Timeframe = {
  from: string | '',
  to: string | '',
};

type Coordinator = {
  name: string,
  type?: string,
  address?: string,
  region?: string,
  country?: string,
  website?: string,
  phone?: string,
  email?: string,
};

type Partner = {
  name: string,
  type?: string,
  address?: string,
  region?: string,
  country?: string,
  website?: string,
};

type Budget = {
  eu_contrib: number,
  total_cost?: number | 0,
  private_fund?: number | 0,
  public_fund?: number | 0,
  other_contrib?: number | 0,
  funding_area?: string | '',
};

type RelatedLink = {
  url: string | '',
  label: string | '',
};

export type Project = {
  project_id: string,
  title: string,
  description: string,
  cover_image: string,
  programme_name: string,
  project_website: string,
  budget: Budget,
  results: Result,
  timeframe: Timeframe,
  ec_priorities: Array<string>,
  coordinators: Array<Coordinator>,
  partners: Array<Partner>,
  project_locations: Array<Location>,
  related_links: Array<RelatedLink>,
};
