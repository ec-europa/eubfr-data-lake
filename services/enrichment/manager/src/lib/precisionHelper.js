export const precisionHelper = loc => {
  if (loc.centroid) {
    return 3;
  }
  if (loc.postal_code) {
    return 2;
  }
  if (loc.region) {
    return 1;
  }
  if (loc.country_code) {
    return 0;
  }
};
