import { mergeRecords } from './merge';
// import { enrichCurrency } from '../plugins/currency';

export const enrich = async (record, existingRecord) => {
  /* if (!record.project_locations || record.project_locations.length === 0) {
    return record;
  } */

  const enrichedRecord = mergeRecords(record, existingRecord);

  // DO THE WORK
  console.log('ENRICH CURRENCY');

  return enrichedRecord;
};

export default enrich;
