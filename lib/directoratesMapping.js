// @flow

// Source http://publications.europa.eu/code/en/en-390600.htm
const directoratesMapping: Map<string, string> = new Map([
  ['CONNECT', 'CNECT'],
  ['INFSO', 'CNECT'],
  ['FPIS', 'FPI'],
  ['BEPA', 'EPSC'],
  ['ELARG', 'NEAR'],
  ['SANCO', 'SANTE'],
  ['MARKT', 'FISMA'],
  ['ENTR', 'GROW'],
]);

export default directoratesMapping;
