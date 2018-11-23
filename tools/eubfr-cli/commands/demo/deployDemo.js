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
const getDemos = require('../../lib/getDemos');
const getServiceLocation = require('../../lib/getServiceLocation');
const getAllProducers = require('../../lib/getAllProducers');

const config = require('../../../../config.json');

const deployDemo = async ({ producer }) => {
  const demos = getDemos();
  const demosToDeploy = producer === '*' ? getAllProducers() : [producer];

  for (const producerName of demosToDeploy) {
    for (const demo of demos) {
      const cwd = path.resolve(`${getServiceLocation(demo)}`);

      if (demo.includes('server')) {
        console.time(`${demo}-${producerName}`);

        console.log(`Server (${producerName}): deploying`);

        await shell(`yarn deploy --username ${producerName}`, { cwd });

        console.log(`Server (${producerName}): deployed`);
        console.timeEnd(`${demo}-${producerName}`);
      }

      if (demo.includes('client')) {
        console.time(`${demo}-${producerName}`);
        console.log(`Client (${producerName}): clean previous build`);
        await shell('rm -rf build', { cwd });

        console.log(`Client (${producerName}): building`);
        process.env.EUBFR_USERNAME = producerName;
        await shell('yarn run build', { cwd, env: process.env });

        console.log(`Client (${producerName}): deploying`);
        await shell(
          `yarn run sls client deploy --username ${producerName} --no-confirm`,
          { cwd }
        );

        console.log(`Client (${producerName}): deployed`);
        console.timeEnd(`${demo}-${producerName}`);
        console.log(
          `Demo dashboard is now available at http://eubfr-${
            config.stage
          }-${demo}-${producerName}.s3-website.${config.region}.amazonaws.com`
        );
      }
    }
  }
};

module.exports = deployDemo;
