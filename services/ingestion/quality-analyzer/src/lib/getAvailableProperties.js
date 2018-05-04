const specialFields = [
  'total_cost',
  'eu_contrib',
  'private_fund',
  'public_fund',
  'other_contrib',
  'centroid',
  'location',
];

const getNormalizedObject = initialObject => {
  const has = (object, key) =>
    object ? hasOwnProperty.call(object, key) : false;

  // A monetary field in budget, value is enough of the all
  if (has(initialObject, 'currency')) {
    return { value: initialObject.value };
  }

  // A centroid with latitude and longitude
  if (has(initialObject, 'lat') || has(initialObject, 'lon')) {
    return { skipDepper: true };
  }

  // We care only if there are coordinates or not, not about their values
  if (has(initialObject, 'type') && has(initialObject, 'coordinates')) {
    return { coordinates: true };
  }

  return initialObject;
};

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
    if (typeof obj[property] === 'object') {
      const fieldIsSpecial = specialFields.includes(property);
      const ObjectUnderInvestigation = fieldIsSpecial
        ? getNormalizedObject(obj[property])
        : obj[property];

      // If no previous stack, then property is sufficient as a root.
      const setStack = stack === '' ? property : `${stack}.${property}`;
      // Re-iterate
      getAvailableProperties(ObjectUnderInvestigation, results, setStack);
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
