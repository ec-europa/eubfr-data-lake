import stream from 'stream';

export default ({ key, BUCKET, s3, onError, callback }) => {
  const pass = new stream.PassThrough();

  const params = {
    Bucket: BUCKET,
    Key: `${key}.ndjson`,
    Body: pass,
    ContentType: 'application/x-ndjson',
  };

  s3.upload(params, err => {
    if (err) {
      return onError(err);
    }
    return callback(null, 'uploaded');
  });

  return pass;
};
