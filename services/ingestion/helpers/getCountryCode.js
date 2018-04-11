// Helper to translate few specific NUTS0 codes to ISO 3166-1 Alpha-2 country codes
module.exports = countryCode => {
  // Do nothing if falsy
  if (!countryCode) return countryCode;

  switch (countryCode.trim().toUpperCase()) {
    case 'UK':
      return 'GB';

    // Greece
    case 'EL':
      return 'GR';

    default:
      return countryCode;
  }
};
