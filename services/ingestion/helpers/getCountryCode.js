// Helper to get country code based on few exceptions
module.exports = countryCode => {
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
