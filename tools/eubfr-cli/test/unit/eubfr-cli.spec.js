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
  test('has its own help menu', async () => {
    const command = `npx eubfr-cli upload -h`;
    const result = await execute(command, { cwd });
    expect(result.stdout).toMatchSnapshot();
  });
});

describe('The EUBFR CLI: show command', () => {
  test('has its own help menu', async () => {
    const command = `npx eubfr-cli show -h`;
    const result = await execute(command, { cwd });
    expect(result.stdout).toMatchSnapshot();
  });
});

describe('The EUBFR CLI: delete command', () => {
  test('has its own help menu', async () => {
    const command = `npx eubfr-cli delete -h`;
    const result = await execute(command, { cwd });
    expect(result.stdout).toMatchSnapshot();
  });
});
