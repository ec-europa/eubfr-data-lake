/**
 * @jest-environment node
 */

import AWS from 'aws-sdk-mock';
import AWS_SDK from 'aws-sdk';

import handler from '../../../src/api/upsert'; // eslint-disable-line import/no-named-as-default
import eventStub from '../../stubs/eventHttpApiGateway.json';

// Explicitly set the correct module, as it might not map correctly after transpilation.
AWS.setSDKInstance(AWS_SDK);

describe(`Service aws-node-singned-uploads: S3 mock for successful operations`, () => {
  beforeAll(() => {
    AWS.mock('S3', 'getSignedUrl', (method, _, callback) => {
      callback(null, {
        data: 'https://example.com',
      });
    });

    AWS.mock('IAM', 'listGroupsForUser', (method, callback) => {
      callback(null, {
        Groups: [
          {
            GroupName: 'Producers',
          },
        ],
      });
    });
  });

  afterEach(() => {
    delete process.env.BUCKET;
    delete process.env.REGION;
  });

  afterAll(() => {
    AWS.restore('S3');
    AWS.restore('IAM');
  });

  test('Require environment variables', async () => {
    try {
      await handler();
    } catch (error) {
      expect(error.message).toEqual(
        'BUCKET and REGION environment variables are required!'
      );
    }
  });

  test('Require a header "x-amz-meta-producer-key"', async () => {
    process.env.BUCKET = 'foo';
    process.env.REGION = 'bar';

    const event = {
      requestContext: {
        identity: {
          userArn: 'arn:aws:iam::123456789012:user/test',
        },
      },
    };

    const context = {};

    try {
      const result = await handler(event, context);
      expect(result).toMatchSnapshot();
    } catch (error) {
      console.error(error);
    }
  });

  test('Replies back with a JSON for a signed upload on success', async () => {
    process.env.BUCKET = 'foo';
    process.env.REGION = 'bar';

    // Deep clone
    const event = JSON.parse(JSON.stringify(eventStub));
    const context = {};

    try {
      const result = await handler(event, context);
      expect(result).toMatchSnapshot();
    } catch (error) {
      console.error(error);
    }
  });
});

describe('Service aws-node-singned-uploads: S3 mock for failed operations', () => {
  beforeAll(() => {
    AWS.mock('S3', 'getSignedUrl', (method, _, callback) => {
      callback('S3 failed');
    });

    AWS.mock('IAM', 'listGroupsForUser', (method, callback) => {
      callback(null, {
        Groups: [
          {
            GroupName: 'Producers',
          },
        ],
      });
    });
  });

  afterEach(() => {
    delete process.env.BUCKET;
    delete process.env.REGION;
  });

  afterAll(() => {
    AWS.restore('S3');
    AWS.restore('IAM');
  });
});
