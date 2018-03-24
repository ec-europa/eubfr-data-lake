export default country => {
  switch (country) {
    case 'БЪЛГАРИЯ (BULGARIA)':
      return 'BG';
    case 'HRVATSKA':
      return 'HR';
    case 'FRANCE':
      return 'FR';
    case 'ESPAÑA':
      return 'ES';
    case 'ITALIA':
      return 'IT';
    case 'DEUTSCHLAND':
      return 'DE';
    case 'SLOVENIJA':
      return 'SI';
    case 'POLSKA':
      return 'PL';
    case 'MALTA':
      return 'MT';
    case 'PORTUGAL':
      return 'PT';
    case 'ÖSTERREICH':
      return 'AT';
    case 'ΕΛΛΑΔΑ (ELLADA)':
      return 'GR';
    case 'NEDERLAND':
      return 'NL';
    case 'SVERIGE':
      return 'SE';
    case 'SLOVENSKO':
      return 'sk';
    case 'BELGIQUE-BELGIË':
      return 'BE';
    case 'ČESKÁ REPUBLIKA':
      return 'CZ';
    case 'EESTI':
      return 'EE';
    case 'ROMÂNIA':
      return 'RO';
    case 'LIETUVA':
      return 'LT';
    case 'UNITED KINGDOM':
      return 'GB';
    case 'LUXEMBOURG':
      return 'LU';
    case 'MAGYARORSZÁG':
      return 'HU';
    case 'LATVIJA':
      return 'LV';
    case 'IRELAND':
      return 'IE';
    case 'ΚΥΠΡΟΣ (KYPROS)':
      return 'CY';
    case 'DANMARK':
      return 'DK';
    case 'NORWAY':
      return 'NO';
    case 'SUOMI / FINLAND':
      return 'FI';
    case 'ICELAND':
      return 'IS';

    default:
      // To match type
      return '';
  }
};
