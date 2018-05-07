// @flow

const has = (object, key) =>
  object ? hasOwnProperty.call(object, key) : false;

const specialFields = [
  // monetary
  'total_cost',
  'eu_contrib',
  'private_fund',
  'public_fund',
  'other_contrib',
  // we only need to know if centroid is present
  'centroid',
  // we care only for the coordinates
  'location',
];

/**
 * Takes a object with exceptional structure and returns part of the initial object which is actually useful.
 *
 * @param {Object} initialObject The object representing a special value of a field.
 * @returns {Object} Only a selected part of the {initialObject} which is actually needed.
 *
 * @example
 * input => { "value": 20511539, "currency": "EUR", "raw": "20511539" }
 * output => { "value": 20511539 }
 *
 * @example
 * We care only about the value of a monetary field, new normalized structure is returned.
 *
 * input => { "value": 20511539, "currency": "EUR", "raw": "20511539" }
 * output => { "value": 20511539 }
 *
 * We care only if a centroid has latitude or longitude, `lat` and `lon` fields are skipped.
 *
 * input => { "lat": 52.022163, "lon": 20.914336 }
 * output => { skip: true }
 *
 * We care only if coordinates are present, `coordinates` field is preseved.
 *
 * input => { "type": "Point", "coordinates": [20.914336, 52.022163] }
 * output => { coordinates: true }
 *
 */
const getNormalizedObject = (initialObject: Object): Object => {
  // A monetary field in budget, value is enough of the all
  if (has(initialObject, 'currency')) {
    return { value: initialObject.value };
  }

  // A centroid with latitude and longitude, skip as we care only that it has .centroid
  // This is how we IGNORE the property/field of current level
  if (has(initialObject, 'lat') && has(initialObject, 'lon')) {
    return { skip: true };
  }

  // We care only if there are coordinates or not, not about their values
  // This is how we KEEP the property/field of current level
  if (has(initialObject, 'type') && has(initialObject, 'coordinates')) {
    return { coordinates: true };
  }

  return initialObject;
};

/**
 * Flags whether a given value is useful or not.
 *
 * @param {any} input The input to varify
 *
 * @returns {boolean} Whether acceptable.
 *
 */
const hasUsefulData = input => {
  const unAcceptableValues = [0, '0', 'EUR', '', null];

  if (!unAcceptableValues.includes(input)) {
    return true;
  }

  return false;
};

/**
 * Get information about which fields of an object are not empty.
 * To use, initiate `results` out of the scope of this function and call it on it.
 * Function does not return but accumulates results in `results`.
 *
 * @param {Object} obj Input object to inspect.
 * @param {Array<string>} results The accumulator of results after function's invocation.
 * @param {string} stack The string representation of a nested field in an object as deep as necessary.
 *
 * @returns {boolean} Whether acceptable.
 *
 */
const getAvailableProperties = (
  obj: Object,
  results: Array<string>,
  stack: string = ''
): void => {
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
    } else if (hasUsefulData(obj[property]) && !has(results, stack)) {
      // nothing nested, make this property the root of the stack for this property
      if (stack === '') {
        results.push(property);
      } else {
        // The stack is the nested fields information
        const setStack = property === 'skip' ? stack : `${stack}.${property}`;
        results.push(setStack);
      }
    }
  });
};

export default getAvailableProperties;
