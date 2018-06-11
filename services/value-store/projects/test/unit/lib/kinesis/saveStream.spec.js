/**
 * @jest-environment node
 */

import fs from 'fs';
import path from 'path';
import split2 from 'split2';
import through2Batch from 'through2-batch';
import SaveStreamInstance from './SaveStreamClass';

describe('Using through2-batch', () => {
  let file = '';
  let fileReadStream = '';

  beforeAll(() => {
    file = path.resolve(`${__dirname}/../../stubs/sample.ndjson`);
    fileReadStream = fs.createReadStream(file);
  });

  test('Ensures all records are batched correctly', () => {
    let batches = 0;
    let records = 0;

    return new Promise((resolve, reject) => {
      fileReadStream
        .on('error', e => reject(e))
        .pipe(split2(JSON.parse))
        .on('error', e => reject(e))
        .pipe(
          through2Batch.obj({ batchSize: 10 }, (batch, _, cb) => {
            // count the batch
            batches += 1;

            const improvedBatch = batch.map(item => {
              // count the records
              records += 1;

              // Emulate some sort of transformation in batch
              return Object.assign({ transformed: true }, item);
            });

            return cb(null, improvedBatch);
          })
        )
        .on('error', e => reject(e))
        .on('finish', () => {
          // Basically, make sure all records are taken into account.
          expect(batches).toEqual(2);
          expect(records).toEqual(15);
          resolve();
        });
    });
  });

  test('Batched records are all reaching writable stream', () => {
    // simplified way to spy on what's going on in the writable
    const saveStream = new SaveStreamInstance({ objectMode: true });

    return new Promise((resolve, reject) => {
      fileReadStream
        .on('error', e => reject(e))
        .pipe(split2(JSON.parse))
        .on('error', e => reject(e))
        .pipe(
          through2Batch.obj({ batchSize: 6 }, (batch, _, cb) => {
            const improvedBatch = batch.map(item =>
              // Emulate some sort of transformation in batch
              Object.assign({ transformed: true }, item)
            );

            saveStream.write(improvedBatch, cb);
          })
        )
        .on('error', e => reject(e))
        .pipe(saveStream)
        .on('finish', resolve);
    });
  });
});
