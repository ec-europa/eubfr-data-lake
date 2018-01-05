// Small helper for serverless.yml to discover an environment variable.
const path = require('path');

// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config({
  path: path.resolve(__dirname, '../.env'),
});

module.exports.EUBFR_ES_PROJECTS_DOMAIN = () =>
  process.env.EUBFR_ES_PROJECTS_DOMAIN;
