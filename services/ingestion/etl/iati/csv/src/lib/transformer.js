import transform from 'stream-transform';
import transformRecord from './transform';

const transformer = transform(
  (record, cb) => {
    try {
      const data = transformRecord(record);
      return cb(null, `${JSON.stringify(data)}\n`);
    } catch (e) {
      return cb(e);
    }
  },
  { parallel: 10 }
);

export default transformer;
