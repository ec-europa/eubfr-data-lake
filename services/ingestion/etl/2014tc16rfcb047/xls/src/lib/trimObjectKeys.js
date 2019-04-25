const trimObjectKeys = o => {
  const newObject = {};

  Object.keys(o).forEach(key => {
    const newKey = key.trim();
    newObject[newKey] = o[key];
  });

  return newObject;
};

module.exports = trimObjectKeys;
