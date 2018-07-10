// @flow
import request from 'request-promise-native';
import type { BudgetItem, TimePrecision } from '@eubfr/types';

const padDate = (date: number): number | string =>
  date < 10 ? `0${date}` : date;

export const getEuroValue = async (
  inputBudgetItem: BudgetItem,
  projectEndDate: Date,
  projectEndPrecision: TimePrecision
) => {
  let euroValue = null;
  const precision = 100; // round converted value to the nearest 100

  // Least precision: year
  let period = projectEndDate.getFullYear();
  let apiPeriod = 'A';

  // Best precision: day
  if (projectEndPrecision === 'day') {
    const month = projectEndDate.getMonth() + 1;
    const day = projectEndDate.getDate();
    period = `${period}-${padDate(month)}-${padDate(day)}`;
    apiPeriod = 'D';
  }

  // If not a day, try at least: month
  else if (projectEndPrecision === 'month') {
    const month = projectEndDate.getMonth() + 1;
    period = `${period}-${padDate(month)}`;
    apiPeriod = 'M';
  }

  // "EXR/A.[currency].EUR.SP00.A" corresponds to the key of a dataset
  // The keys can be found here: http://sdw.ecb.europa.eu/browseTable.do?node=1495
  // API info: https://sdw-wsrest.ecb.europa.eu/web/generator/index.html
  const url = `https://sdw-wsrest.ecb.europa.eu/service/data/EXR/${apiPeriod}.${
    inputBudgetItem.currency
  }.EUR.SP00.A`;

  let results;
  const qs = {
    startPeriod: period,
    endPeriod: period,
    detail: 'dataonly',
  };

  try {
    results = await request.get({
      url,
      qs,
      json: true,
      headers: {
        Accept: 'application/vnd.sdmx.data+json;version=1.0.0-wd',
      },
    });
  } catch (e) {
    console.error('error', url, qs, e);
    return euroValue;
  }

  if (
    results &&
    results.dataSets &&
    results.dataSets[0] &&
    results.dataSets[0].series &&
    results.dataSets[0].series['0:0:0:0:0'] &&
    results.dataSets[0].series['0:0:0:0:0'].observations &&
    results.dataSets[0].series['0:0:0:0:0'].observations[0]
  ) {
    const exr = results.dataSets[0].series['0:0:0:0:0'].observations['0'][0];
    euroValue = Math.ceil(inputBudgetItem.value / exr / precision) * precision;
  }

  // Fallback request decreasing precision from daily to monthly
  if (results === undefined && projectEndPrecision === 'day') {
    euroValue = await getEuroValue(inputBudgetItem, projectEndDate, 'month');
  }

  return euroValue;
};

export default getEuroValue;
