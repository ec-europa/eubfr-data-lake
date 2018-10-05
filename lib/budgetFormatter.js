import numeral from 'numeral';

const precision = 100; // round converted value to the nearest 100

// Common conversions
const staticMapping = {
  ECU: 'EUR',
  FF: 'FRF',
  DM: 'DEM',
};

// Fixed euro conversion rates
// https://www.ecb.europa.eu/euro/intro/html/index.en.html
const fixedRates = {
  BEF: 40.3399,
  DEM: 1.95583,
  EEK: 15.6466,
  IEP: 0.787564,
  GRD: 340.75,
  ESP: 166.386,
  CYP: 0.585274,
  FRF: 6.55957,
  ITL: 1936.27,
  LVL: 0.702804,
  LTL: 3.4528,
  LUF: 40.3399,
  MTL: 0.4293,
  NLG: 2.20371,
  ATS: 13.7603,
  PTE: 200.482,
  SIT: 239.64,
  SKK: 30.126,
  FIM: 5.94573,
};

// Ensures a given set of exceptions are handled properly before numeral.
export const prepareValue = value => {
  if (typeof value !== 'string') return value;

  const containsDots = value.includes('.');
  const containsCommas = value.includes(',');

  if (!containsDots && !containsCommas) return value;

  let formatted = value;
  const numDots = (value.match(RegExp('\\.', 'g')) || []).length;
  const numCommas = (value.match(RegExp('\\,', 'g')) || []).length;

  if (numDots === 1) {
    const breakdown = value.split('.');
    const last = breakdown[breakdown.length - 1];
    const fraction = last.length;
    if (fraction && fraction > 2 && !last.includes(',')) {
      formatted = formatted.replace(/\./g, '');
    }
  } else if (numCommas === 1) {
    const breakdown = value.split(',');
    const last = breakdown[breakdown.length - 1];
    const fraction = last.length;
    if (fraction && fraction > 2 && !last.includes('.')) {
      formatted = formatted.replace(/,/g, '');
    }
    formatted = formatted.replace(/,/g, '.');
  }

  if (numDots > 1) {
    formatted = formatted.replace(/\./g, '');
  }

  if (numCommas > 1) {
    formatted = formatted.replace(/,/g, '');
  }

  formatted = formatted.trim().replace(/\s/g, '');

  return formatted;
};

export const sanitizeValue = value => {
  if (!value) return 0;

  const formatted = prepareValue(value);

  const sanitizedValue = Math.abs(numeral(formatted).value()) || 0;

  // Prevent long values
  if (sanitizedValue > 9223372036854775807) return 0;

  return sanitizedValue;
};

export const sanitizeCurrency = (currency, value) => {
  if (!currency || !value) return '';

  if (currency in staticMapping) return staticMapping[currency];

  return currency;
};

export const sanitizeRaw = raw => {
  if (!raw) return '';

  return raw;
};

export const sanitizeBudgetItem = budget => {
  if (!budget) return { value: 0, currency: '', raw: '' };

  // Manually clone budget (only keep needed properties)
  const sanitizedValue = sanitizeValue(budget.value);
  let sanitizedBudget = {
    value: sanitizedValue,
    currency: sanitizeCurrency(budget.currency, sanitizedValue),
    raw: sanitizeRaw(budget.raw),
  };

  if (budget._original) {
    const sanitizedOriginalValue = sanitizeValue(budget._original.value);

    sanitizedBudget._original = {
      value: sanitizedOriginalValue,
      currency: sanitizeCurrency(
        budget._original.currency,
        sanitizedOriginalValue
      ),
      raw: sanitizeRaw(budget._original.raw),
    };
  }

  // Convert replaced currencies into EUR
  if (sanitizedBudget.currency in fixedRates) {
    const newValue =
      Math.ceil(
        sanitizedBudget.value / fixedRates[sanitizedBudget.currency] / precision
      ) * precision;

    sanitizedBudget = {
      value: newValue,
      currency: newValue > 0 ? 'EUR' : '',
      raw: `EUR ${newValue}`,
      _original: {
        value: sanitizedBudget.value,
        currency: sanitizedBudget.currency,
        raw: sanitizedBudget.raw,
      },
    };
  }

  return sanitizedBudget;
};

export default sanitizeBudgetItem;
