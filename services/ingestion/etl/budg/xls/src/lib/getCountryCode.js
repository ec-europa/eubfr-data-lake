// Helper to get country code based on few exceptions
export default countryCode => {
  switch (countryCode.trim().toUpperCase()) {
    case 'uk':
      return 'GB';

    // Greece
    case 'el':
      return 'GR';

    default:
      return countryCode;
  }
};
