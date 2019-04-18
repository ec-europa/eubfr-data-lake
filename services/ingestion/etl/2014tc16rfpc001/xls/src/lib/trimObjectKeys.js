const trimObjectKeys = o => {
  const newObject = {};

  Object.keys(o).forEach(key => {
    const newKey = key.trim().replace(/(\r\n|\n|\r)/gm, '');
    newObject[newKey] = o[key];
  });

  return newObject;
};

module.exports = trimObjectKeys;
