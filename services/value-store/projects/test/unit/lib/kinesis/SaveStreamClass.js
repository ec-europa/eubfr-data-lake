import stream from 'stream';

export default class SaveStream extends stream.Writable {
  _write(batch, _, next) {
    console.log(batch);
    next();
  }
}
