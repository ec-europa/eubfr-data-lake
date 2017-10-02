import mapper from '../../src/transform';
import testRecord from '../record.json';

describe(`DG BUDG CSV transformer`, () => {
  let result = {};

  beforeAll(() => {
    result = mapper(testRecord);
  });

  test(`Throws an error on empty input`, () => {
    expect(mapper).toThrow();
  });

  test(`Timeframe information is transformed into a single object field`, () => {
    expect(result.timeframe).toBeDefined();
  });

  test(`Timeframe's "from" field is present`, () => {
    expect(result.timeframe.from).toBeDefined();
  });

  test(`Timeframe's "to" field is present`, () => {
    expect(result.timeframe.to).toBeDefined();
  });

  test(`"Name" source field is transformed to "title"`, () => {
    expect(result.title).toBeDefined();
    expect(result.title).toBe(`Central European Green Corridors`);
  });

  test(`"Related links" source field is transformed to "related_links"`, () => {
    expect(result.related_links).toBeDefined();
    expect(result.related_links).toBeTruthy();
  });

  test(`"Related links" has URL values correctly split`, () => {
    expect(result.related_links[0].url).toBeDefined();
    expect(result.related_links[0].label).toBeDefined();
  });

  test(`"Project location latitude" and "Project location longitude" move to "project_locations"`, () => {
    expect(result.project_locations).toBeDefined();
    // "AT;HR;DE;SK;SI" => there should be 5 locations.
    expect(result.project_locations.length).toBe(5);
  });

  test(`Project location information is correctly mapped`, () => {
    const firstLocation = result.project_locations[0];
    expect(firstLocation.geolocation).toBeDefined();
    expect(firstLocation.geolocation.lat).toBeDefined();
    expect(firstLocation.geolocation.lat).toBe(`48.211312000000`);
    expect(firstLocation.geolocation.long).toBeDefined();
    expect(firstLocation.geolocation.long).toBe(`16.367315000000`);
    expect(firstLocation.name).toBeDefined();
    expect(firstLocation.name).toBe(`AT`);
  });
});

describe(`DG BUDG transformer handling incomplete or inconsistent data`, () => {
  const partialRecord = {
    Name: 'Bulgaria’s capital expands metro network',
    'Timeframe start': '1388530800',
    'Timeframe end': '1420066800',
    'Project location latitude': '42.73806663',
    'Project location longitude': '23.40014509',
    'Project country(ies)': '',
    'EC’s priorities': '',
    Coordinators: '',
    Partners: '',
    'Related links': '',
  };

  test(`Certain fields should always be present after transformation`, () => {
    const partialResult = mapper(partialRecord);
    expect(partialResult.cover_image).toBeFalsy();
    expect(partialResult.programme_name).toBeFalsy();
    expect(partialResult.description).toBeFalsy();
    expect(partialResult.results).toBeFalsy();
    expect(partialResult.ec_priorities).toBeDefined();
    expect(partialResult.coordinators).toBeDefined();
    expect(partialResult.eu_budget_contribution).toBeFalsy();
    expect(partialResult.partners).toBeDefined();
    expect(partialResult.project_locations).toBeDefined();
    expect(partialResult.timeframe).toBeDefined();
    expect(partialResult.timeframe.from).toBeDefined();
    expect(partialResult.timeframe.to).toBeDefined();
    expect(partialResult.project_website).toBeFalsy();
    expect(partialResult.related_links).toBeDefined();
  });
});
