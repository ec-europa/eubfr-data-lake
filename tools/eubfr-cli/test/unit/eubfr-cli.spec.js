/**
 * @jest-environment node
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');

const execute = promisify(exec);

// Execute from project root to make use of workspace's symlinking
const cwd = path.resolve(`${__dirname}../../../../../`);

// Create a sample config.json for tests, if the file doesn't exist yet.
const createSampleConfigFile = () => {
  const configFilePath = '../../config.json';
  const configSample = {
    eubfr_env: 't-dev',
    region: 'eu-central-1',
    stage: 't-stage',
    demo: {
      agri: {
        AWS_ACCESS_KEY_ID: 'foo',
        AWS_SECRET_ACCESS_KEY: 'bar',
      },
    },
  };

  if (!fs.existsSync(configFilePath)) {
    fs.writeFileSync(configFilePath, JSON.stringify(configSample));
  }
};

describe('The EUBFR CLI: help menu', () => {
  beforeAll(() => createSampleConfigFile());

  test('is displayed if no arguments or options are passed', async () => {
    const command = `npx eubfr-cli`;
    const result = await execute(command, { cwd });
    expect(result.stdout).toMatchSnapshot();
  });

  test('is displayed on -h or --help flags', async () => {
    const command = `npx eubfr-cli`;
    const result = await execute(command, { cwd });
    expect(result.stdout).toMatchSnapshot();
  });
});

describe('The EUBFR CLI: upload command', () => {
  beforeAll(() => createSampleConfigFile());

  test('has its own help menu', async () => {
    const command = `npx eubfr-cli upload -h`;
    const result = await execute(command, { cwd });
    expect(result.stdout).toMatchSnapshot();
  });

  test('requires `.content` folder if no options specified', async () => {
    const command = `npx eubfr-cli upload`;
    const result = execute(command, { cwd });
    expect(result).rejects.toThrow();
  });

  test('requires a producer when a file is specified', async () => {
    const command = `npx eubfr-cli upload foo`;
    const result = execute(command, { cwd });
    expect(result).rejects.toThrow('error: Missing required input parameters');
  });

  test('requires a correct value for the producer, even if the -p flag is used', async () => {
    const command = `npx eubfr-cli upload foo -p`;
    const result = execute(command, { cwd });
    expect(result).rejects.toThrow('error: Missing required input parameters');
  });

  test('requires a valid producer', async () => {
    const command = `SIGNED_UPLOADS_API=http://example.com npx eubfr-cli upload foo -p bar`;
    const result = await execute(command, { cwd });
    expect(result.stderr).toEqual(
      expect.stringMatching("Couldn't find credentials for producer")
    );
  });
});

describe('The EUBFR CLI: show command', () => {
  test('has its own help menu', async () => {
    const command = `npx eubfr-cli show -h`;
    const result = await execute(command, { cwd });
    expect(result.stdout).toMatchSnapshot();
  });

  test('requires either a file or a producer parameter', async () => {
    const command = `npx eubfr-cli show`;
    const result = execute(command, { cwd });
    expect(result).rejects.toThrow('error: Missing required input parameters');
  });

  test('requires actual value when producer flag is used', async () => {
    const command = `npx eubfr-cli show -p`;
    const result = execute(command, { cwd });
    expect(result).rejects.toThrow(
      'error: Please specificy producer with a name.'
    );
  });
});

describe('The EUBFR CLI: delete command', () => {
  test('has its own help menu', async () => {
    const command = `npx eubfr-cli delete -h`;
    const result = await execute(command, { cwd });
    expect(result.stdout).toMatchSnapshot();
  });

  test('requires DELETER_API environment variable', () => {
    const command = `npx eubfr-cli delete -c`;
    const result = execute(command, { cwd });
    expect(result).rejects.toThrow(
      'DELETER_API environment variable is missing.'
    );
  });
});
