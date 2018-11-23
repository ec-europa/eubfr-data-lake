/**
 * Because current approach of creation of demo applications
 * depend on 1 folder (1 service) creating resources in 1 place,
 * which is not possible with tools such as webpack and serverless,
 * deployments have to wait for each other. Thus, async/await in for or loop.
 */

/* eslint no-await-in-loop: 0 */
/* eslint no-restricted-syntax: 0 */

const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');

const shell = promisify(exec);

// Utilities
const getServiceLocation = require('../../lib/getServiceLocation');
const getAllProducers = require('../../lib/getAllProducers');

const config = require('../../../../config.json'); // eslint-disable-line import/no-unresolved

const deployDemo = async ({ producer }) => {
  const demos = ['demo-dashboard-server', 'demo-dashboard-client'];
  const usernames = producer === '*' ? getAllProducers() : [producer];

  for (const username of usernames) {
    for (const demo of demos) {
      const cwd = path.resolve(`${getServiceLocation(demo)}`);

      if (demo.includes('server')) {
        console.time(`${demo}-${username}`);

        console.log(`Server (${username}): deploying`);

        await shell(`yarn deploy --username ${username}`, { cwd });

        console.log(`Server (${username}): deployed`);
        console.timeEnd(`${demo}-${username}`);
      }

      if (demo.includes('client')) {
        console.time(`${demo}-${username}`);
        console.log(`Client (${username}): clean previous build`);
        await shell('rm -rf build', { cwd });

        console.log(`Client (${username}): building`);
        process.env.EUBFR_USERNAME = username;
        await shell('yarn run build', { cwd, env: process.env });

        console.log(`Client (${username}): deploying`);
        await shell(
          `yarn run sls client deploy --username ${username} --no-confirm`,
          { cwd }
        );

        console.log(`Client (${username}): deployed`);
        console.timeEnd(`${demo}-${username}`);
        console.log(
          `Demo dashboard is now available at http://eubfr-${
            config.stage
          }-${demo}-${username}.s3-website.${config.region}.amazonaws.com`
        );
      }
    }
  }
};

module.exports = deployDemo;
