const hasUsefulData = input => {
  const unAcceptableValues = [0, '0', 'EUR', '', null];

  if (!unAcceptableValues.includes(input)) {
    return true;
  }

  return false;
};

const getAvailableProperties = (obj, results, stack = '') => {
  if (!obj) {
    return;
  }

  Object.keys(obj).forEach(property => {
    // If the value of this property is an object, then it's nested, re-iterate
    if (typeof obj[property] === 'object') {
      // If no previous stack, then property is sufficient as a root.
      const setStack = stack === '' ? property : `${stack}.${property}`;
      // Re-iterate
      getAvailableProperties(obj[property], results, setStack);
    } else if (hasUsefulData(obj[property]) && !results[stack]) {
      // nothing nested, use the property
      if (stack === '') {
        results.push(property);
      } else {
        // The stack is the nested fields information
        results.push(stack);
      }
    }
  });
};

export default getAvailableProperties;
