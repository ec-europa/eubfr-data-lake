const improveObjectKeys = o => {
  const newObject = {};

  Object.keys(o).forEach(key => {
    const newKey = key
      .trim()
      .replace(/(\r\n|\n|\r)/gm, '')
      .replace(/ {1,}/g, ' ');

    newObject[newKey] = o[key];
  });

  return newObject;
};

module.exports = improveObjectKeys;
