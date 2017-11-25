// @flow

// Project model is discussed in EUBFR-4 EUBFR-5 and EUBFR-70

type Result = {
  result: string,
};

type Geolocation = {
  lat: string,
  lon: string,
};

type Location = {
  country_name?: string,
  country_code: string,
  geolocation: Geolocation,
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
