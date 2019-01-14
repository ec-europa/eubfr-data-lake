/**
 * @jest-environment node
 */

import AWS from 'aws-sdk-mock';
import AWS_SDK from 'aws-sdk';

import { promisify } from 'util';
import upsert from '../../../src/api/upsert';
import eventStub from '../../stubs/eventHttpApiGateway.json';

// Explicitly set the correct module, as it might not map correctly after transpilation.
AWS.setSDKInstance(AWS_SDK);
const handler = promisify(upsert);

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

  test('Require environment variables', () => {
    const event = {
      requestContext: {
        identity: {
          userArn: 'arn:aws:iam::123456789012:user/test',
        },
      },
    };
    const context = {};

    try {
      handler(event, context);
    } catch (error) {
      expect(error.message).toEqual(
        'BUCKET and REGION environment variables are required!'
      );
    }
  });

  test('Require a header "x-amz-meta-producer-key"', () => {
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
      const result = handler(event, context);
      expect(result).resolves.toMatchSnapshot();
    } catch (error) {
      console.error(error);
    }
  });

  test('Replies back with a JSON for a signed upload on success', () => {
    process.env.BUCKET = 'foo';
    process.env.REGION = 'bar';
    const event = eventStub;
    const context = {};

    try {
      const result = handler(event, context);
      expect(result).resolves.toMatchSnapshot();
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
