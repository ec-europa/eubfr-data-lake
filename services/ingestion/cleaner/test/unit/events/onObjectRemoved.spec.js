import { promisify } from 'util';
import onObjectRemoved from '../../../src/events/onObjectRemoved';

// Add stubs
import eventOfficial from '../../stubs/events/onObjectRemoved/event-official.json';
import eventEubfr from '../../stubs/events/onObjectRemoved/event-eubfr.json';

const handler = promisify(onObjectRemoved);

describe(`Function onObjectRemoved in "@eubfr/ingestion-cleaner"`, () => {
  afterEach(() => {
    // ensure that the environment is not left over a test
    delete process.env.BUCKET;
  });

  test('The function requires a BUCKET environment variable', () => {
    // Intentionally remove the environment variable to test the requirement.
    delete process.env.BUCKET;
    const event = {};
    const context = {};

    expect.assertions(1);
    const result = handler(event, context);
    return expect(result).rejects.toBe(
      `BUCKET environment variable is required`
    );
  });

  test('The function expects SNS record with the official event stub', () => {
    process.env.BUCKET = 'foo';
    const event = eventOfficial;
    const context = {};

    expect.assertions(1);
    const result = handler(event, context);
    return expect(result).rejects.toBe(`Bad record`);
  });

  test('The function expects a message body from the actual event stub', () => {
    process.env.BUCKET = 'foo';
    // Remove the message from the actual event to check that the function asserts it.
    delete eventEubfr.Records[0].Sns.Message;

    const event = eventEubfr;
    const context = {};

    expect.assertions(1);
    const result = handler(event, context);
    return expect(result).rejects.toBe(`Missing message body`);
  });
});
