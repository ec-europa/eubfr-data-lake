import stream from 'stream';

export default ({ key, BUCKET, s3, onError }) => {
  const pass = new stream.PassThrough();

  const params = {
    Bucket: BUCKET,
    Key: `${key}.ndjson`,
    Body: pass,
    ContentType: 'application/x-ndjson',
  };

  s3.upload(params, err => {
    if (err) onError(err);
  });

  return pass;
};
