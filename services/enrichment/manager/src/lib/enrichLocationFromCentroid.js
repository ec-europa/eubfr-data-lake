export const enrichLocationFromCentroid = loc => {
  console.log(
    'Will infer country_code from location',
    loc.location.coordinates
  );

  // Use centroid to determine country_code

  return loc; // location not enriched
};

export default enrichLocationFromCentroid;
