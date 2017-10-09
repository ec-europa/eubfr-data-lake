import AWS from 'aws-sdk-mock';
import { promisify } from 'util';
import upsert from '../../../src/api/upsert';
import eventStub from '../../stubs/eventHttpApiGateway.json';

const handler = promisify(upsert);

describe(`Service aws-node-singned-uploads: S3 mock for successful operations`, () => {
  beforeAll(() => {
    AWS.mock('S3', 'getSignedUrl', (method, _, callback) => {
      callback(null, {
        data: 'https://example.com',
      });
    });
  });

  afterEach(() => {
    delete process.env.BUCKET;
    delete process.env.REGION;
  });

  afterAll(() => {
    AWS.restore('S3');
  });

  test(`Require environment variables`, () => {
    const event = {};
    const context = {};

    expect.assertions(1);
    const result = handler(event, context);
    return expect(result).rejects.toBe(
      `BUCKET and REGION environment variable are required.`
    );
  });

  test(`Require a header "x-amz-meta-producer-key"`, () => {
    process.env.BUCKET = 'foo';
    process.env.REGION = 'bar';
    const event = {};
    const context = {};

    const result = handler(event, context);
    expect.assertions(1);
    return expect(result).resolves.toMatchSnapshot();
  });

  test(`Replies back with a JSON for a signed upload on success`, () => {
    process.env.BUCKET = 'foo';
    process.env.REGION = 'bar';
    const event = eventStub;
    const context = {};

    const result = handler(event, context);
    expect.assertions(1);
    return expect(result).resolves.toMatchSnapshot();
  });
});

describe(`Service aws-node-singned-uploads: S3 mock for failed operations`, () => {
  beforeAll(() => {
    AWS.mock('S3', 'getSignedUrl', (method, _, callback) => {
      callback(`S3 failed`);
    });
  });

  afterEach(() => {
    delete process.env.BUCKET;
    delete process.env.REGION;
  });

  afterAll(() => {
    AWS.restore('S3');
  });

  test(`Correctly handles error messages from S3`, () => {
    process.env.BUCKET = 'foo';
    process.env.REGION = 'bar';
    const event = eventStub;
    const context = {};

    expect.assertions(1);
    const result = handler(event, context);
    return expect(result).rejects.toBe(`S3 failed`);
  });
});
