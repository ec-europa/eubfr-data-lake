const counter = collection => {
  const results = [];

  collection.forEach(field => {
    if (!results[field]) {
      results[field] = 1;
    } else {
      results[field] = results[field] + 1;
    }
  });

  return results;
};

const getCoverageReport = (input, numRecords) => {
  if (!input) {
    return {};
  }

  const results = counter(input);

  return Object.keys(results).map(field => {
    // Divide the number of occurences by the overall number of records
    const fieldCoverage = (results[field] / numRecords * 100).toFixed(2);

    return {
      [field]: results[field],
      coverage: fieldCoverage,
    };
  });
};

export default getCoverageReport;
