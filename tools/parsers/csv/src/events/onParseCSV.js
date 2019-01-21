import fs from 'fs';
import path from 'path';
import parse from 'csv-parse';
import transform from 'stream-transform';

import transformRecord from '../lib/transform';

export const handler = () => {
  // Change this in order to work with the right file for your case.
  const file = 'ErasmusPlus_KA3_SupportForPolicyReform_Projects_Overview';
  const readStream = fs.createReadStream(path.resolve(`../../${file}.csv`));
  const writeStream = fs.createWriteStream(
    path.resolve(`../../${file}.ndjson`)
  );

  // Try with both to see the difference.
  // const parser = parse({ columns: true, skip_lines_with_error: true });
  const parser = parse({ columns: true });

  // Transform
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

  readStream
    .pipe(parser)
    .on('error', error => {
      console.error('Parsing error.', error);
    })
    .pipe(transformer)
    .on('error', error => {
      console.error('Transform error.', error);
    })
    .pipe(writeStream)
    .on('error', error => {
      console.error('Writing error.', error);
    })
    .on('end', () => {
      console.log('CSV parsed successfully');
    });
};

export default handler;
