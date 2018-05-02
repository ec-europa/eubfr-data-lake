const hasUsefulData = input => {
  const unAcceptableValues = [0, '0', 'EUR', '', null];

  if (!unAcceptableValues.includes(input)) {
    return true;
  }

  return false;
};

const flatten = a => (Array.isArray(a) ? [].concat(...a.map(flatten)) : a);

const getAvailableProperties = (obj, results, stack = '') => {
  const specialFields = ['budget', 'project_locations', 'timeframe'];

  for (let property in obj) {
    // Handle special cases
    if (specialFields.includes(property)) {
      continue;
    }
    if (obj.hasOwnProperty(property)) {
      if (typeof obj[property] == 'object') {
        // If the value of this property is an object, then it's nested, re-iterate
        getAvailableProperties(obj[property], results, stack + '.' + property);
      } else {
        if (hasUsefulData(obj[property]) && !results[stack]) {
          // nothing nested, use the property
          if (stack === '') {
            results.push(`.${property}`);
          } else {
            // The stack is the nested fields information
            results.push(stack);
          }
        }
      }
    }
  }
};

module.exports = getAvailableProperties;
