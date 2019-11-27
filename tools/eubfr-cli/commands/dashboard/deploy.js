const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');

const shell = promisify(exec);

// Utilities
const getConfigurations = require('../../lib/getConfigurations');
const getServiceLocation = require('../../lib/getServiceLocation');

const dashboardDeployCommand = async () => {
  const { stage, region } = getConfigurations();

  console.time('dashboard:server');

  console.log('Dashboard (server): deploying ...');

  let cwd = path.resolve(`${getServiceLocation('demo-dashboards-server')}`);

  try {
    await shell('yarn deploy', { cwd });

    console.log('Dashboard (server): deployed.');

    console.timeEnd('dashboard:server');

    cwd = path.resolve(`${getServiceLocation('demo-dashboards-client')}`);

    console.time('dashboard:client');

    console.log('Dashboard (client): cleaning previous build ...');
    await shell('rm -rf build', { cwd });

    console.log('Dashboard (client): building ...');

    /**
     * We are skipping preflight checks so that differences in packages' versions won't affect the building process.
     * @see https://github.com/facebook/create-react-app/issues/5247
     */
    process.env.SKIP_PREFLIGHT_CHECK = true;

    await shell('yarn run build', { cwd, env: process.env });

    console.log('Dashboard (client): deploying ...');

    await shell(`yarn run sls client deploy --no-confirm`, { cwd });

    console.timeEnd('dashboard:client');

    return console.log(
      `Dashboard: Ready at http://eubfr-${stage}-dashboard.s3-website.${region}.amazonaws.com`
    );
  } catch (error) {
    return console.error(error);
  }
};

module.exports = dashboardDeployCommand;
