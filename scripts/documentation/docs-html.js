#!/usr/bin/env node

const documentation = require('documentation'); // eslint-disable-line import/no-extraneous-dependencies
const streamArray = require('stream-array'); // eslint-disable-line import/no-extraneous-dependencies
const vfs = require('vinyl-fs'); // eslint-disable-line import/no-extraneous-dependencies
const path = require('path');

documentation
  .build(['types/*.js', 'services/**/*/lib/transform.js'], {})
  .then(comments =>
    documentation.formats.html(comments, {
      'project-name': 'EUBFR ETL documentation',
      'project-description':
        'Information about transform functions used throughout the project.',
      'project-url': 'https://ec.europa.eu/commission/index_en',
      theme: 'node_modules/documentation-theme-ecl',
    })
  )
  .then(output => {
    streamArray(output).pipe(vfs.dest(path.resolve('./dist')));
  });
