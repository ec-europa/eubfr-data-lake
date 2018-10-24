const getCurrency = require('./getCurrency');
const getValue = require('./getValue');

const getCurrencyData = ({ inputString, currenciesPresent }) => {
  const data = {
    currency: '',
    value: 0,
  };

  if (currenciesPresent.normal > 1 || currenciesPresent.symbolic > 1) {
    return data;
  }

  if (currenciesPresent.normal && currenciesPresent.symbolic) {
    return data;
  }

  data.currency = getCurrency(inputString);
  data.value = getValue(inputString);

  return data;
};

module.exports = getCurrencyData;
