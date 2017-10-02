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
