// import request from 'request-promise-native';

// Now getting only NUTS information, coordinates could be useful for other fields as well, such as address, post code, region, etc.
export const enrichCurrency = async loc => {
  // Don't do anything if input is not sufficient
  if (!loc.centroid || !loc.centroid.lat || !loc.centroid.lat) return loc;

  return loc; // location not enriched
};

export default enrichCurrency;
