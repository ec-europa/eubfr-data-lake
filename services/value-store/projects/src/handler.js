import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import through2 from 'through2';
import split2 from 'split2';
import SaveStream from './lib/SaveStream';
import deleteProjects from './lib/deleteProjects';

const { TABLE } = process.env;

export const onObjectCreated = (event, context, callback) => {
  /*
   * Some checks here before going any further
   */

  if (!event.Records) {
    return callback('No record');
  }

  // Only work on the first record
  const snsRecord = event.Records[0];

  // Was the lambda triggered correctly? Is the file extension supported? etc.
  if (!snsRecord || snsRecord.EventSource !== 'aws:sns') {
    return callback('Bad record');
  }

  /*
   * Extract information from the event
   */

  // Extract S3 record
  const s3record = JSON.parse(snsRecord.Sns.Message).Records[0];

  // Retrieve file meta
  const s3 = new AWS.S3();

  // Save record
  const documentClient = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10',
    convertEmptyValues: true,
  });

  return s3
    .headObject({
      Bucket: s3record.s3.bucket.name,
      Key: s3record.s3.object.key,
    })
    .promise()
    .then(data => {
      deleteProjects({
        documentClient,
        table: TABLE,
        key: s3record.s3.object.key,
      }).then(() => {
        const saveStream = new SaveStream({
          objectMode: true,
          documentClient,
          table: TABLE,
        });

        return s3
          .getObject({
            Bucket: s3record.s3.bucket.name,
            Key: s3record.s3.object.key,
          })
          .createReadStream()
          .pipe(split2(JSON.parse))
          .pipe(
            through2.obj((chunk, enc, cb) => {
              // Enhance item to save
              const item = {
                computed_key: s3record.s3.object.key,
                producer_id: s3record.userIdentity.principalId,
                last_modified: data.LastModified.toISOString(), // ISO-8601 date
                ...chunk,
              };

              return cb(null, item);
            })
          )
          .pipe(saveStream);
      });
    })
    .catch(err => callback(err));
};

export const onObjectRemoved = (event, context, callback) => {
  /*
   * Some checks here before going any further
   */

  if (!event.Records) {
    return callback('No record');
  }

  // Only work on the first record
  const snsRecord = event.Records[0];

  // Was the lambda triggered correctly? Is the file extension supported? etc.
  if (!snsRecord || snsRecord.EventSource !== 'aws:sns') {
    return callback('Bad record');
  }

  /*
   * Extract information from the event
   */

  // Extract S3 record
  const s3record = JSON.parse(snsRecord.Sns.Message).Records[0];

  /*
   * Get all records related to the S3 object
   */
  const documentClient = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10',
    convertEmptyValues: true,
  });

  /*
   * Delete existing records
   */
  return deleteProjects({
    documentClient,
    table: TABLE,
    key: s3record.s3.object.key,
  });
};

export const listProjects = (event, context, callback) => {
  console.log(event); // Contains incoming request data (e.g., query params, headers and more)

  const documentClient = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10',
    convertEmptyValues: true,
  });

  const params = {
    TableName: TABLE,
    ProjectionExpression:
      'project_id, title, timeframe, eu_budget_contribution, description',
  };

  console.log('Scanning projects table.');

  const projects = [];

  function onScan(isRoot) {
    return (err, data) => {
      if (err) {
        callback(err);
      } else {
        // print all the movies
        console.log('Scan succeeded.');

        data.Items.forEach(project => {
          projects.push(project);
        });

        // continue scanning if we have more movies, because
        // scan can retrieve a maximum of 1MB of data
        if (typeof data.LastEvaluatedKey !== 'undefined') {
          console.log('Scanning for more...');
          params.ExclusiveStartKey = data.LastEvaluatedKey;
          documentClient.scan(params, onScan(false));
        }

        if (isRoot) {
          const response = {
            statusCode: 200,
            headers: {},
            body: JSON.stringify(projects),
          };

          callback(null, response);
        }
      }
    };
  }

  return documentClient.scan(params, onScan(true));
};
