// @flow

// Project model is discussed in EUBFR-4 EUBFR-5 and EUBFR-70

// prettier-ignore line length
// prettier-ignore
type NestedCoordinates<Coordinates> = Array<Coordinates | NestedCoordinates<Coordinates>>;

type Result = {
  result: string,
};

type Coordinates = [number, number] | [number, number, number];

type GeoJSON = {
  type: string,
  coordinates: NestedCoordinates<Coordinates>,
};

type Location = {
  country_name?: string,
  country_code: string,
  region?: string,
  nuts2?: string,
  location: GeoJSON,
};

type Timeframe = {
  from: string | null,
  to: string | null,
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
  total_cost?: string | null,
  private_fund?: string | null,
  public_fund?: string | null,
  other_contrib?: string | null,
  funding_area?: string | null,
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
};
