const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');

const shell = promisify(exec);

// Utilities
const getConfigurations = require('../../lib/getConfigurations');
const getServiceLocation = require('../../lib/getServiceLocation');

const dashboardDeployCommand = async () => {
  const { stage, region } = getConfigurations();

  const cwd = path.resolve(`${getServiceLocation('demo-dashboards')}`);

  console.time('dashboard');

  console.log('Dashboard: cleaning previous build ...');
  await shell('rm -rf build', { cwd });

  console.log('Dashboard: building ...');

  /**
   * We are skipping preflight checks so that differences in packages' versions won't affect the building process.
   * @see https://github.com/facebook/create-react-app/issues/5247
   */
  process.env.SKIP_PREFLIGHT_CHECK = true;

  await shell('yarn run build', { cwd, env: process.env });

  console.log('Dashboard: deploying ...');

  await shell(`yarn run sls client deploy --no-confirm`, { cwd });

  console.timeEnd('dashboard');
  console.log(
    `Dashboard at http://eubfr-${stage}-dashboard.s3-website.${region}.amazonaws.com`
  );
};

module.exports = dashboardDeployCommand;
