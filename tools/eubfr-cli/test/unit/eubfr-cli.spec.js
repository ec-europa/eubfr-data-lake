/**
 * @jest-environment node
 */

const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');

const execute = promisify(exec);

// Execute from project root to make use of workspace's symlinking
const cwd = path.resolve(`${__dirname}../../../../../`);

describe('The EUBFR CLI: help menu', () => {
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
  test('has a help menu on -h or --help', async () => {
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
    const command = `npx eubfr-cli upload foo -p bar`;
    const result = await execute(command, { cwd });
    expect(result.stderr).toEqual(
      expect.stringMatching("Couldn't find credentials for producer")
    );
  });
});
