#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const documentation = require('documentation'); // eslint-disable-line import/no-extraneous-dependencies

documentation
  .build('types/*.js', {})
  .then(documentation.formats.md)
  .then(output => {
    fs.writeFileSync(path.resolve('./docs/types/Project.md'), output);
  });

const transforms = [
  'agri-csv',
  'cordis-csv',
  'devco-csv',
  'eac-xls',
  'fts-xls',
  'home-xls',
  'iati-csv',
  'inforegio-json',
  'inforegio-xml',
  'valor-xls',
  'wifi4eu-xls',
];

transforms.forEach(transform => {
  const etl = transform.split('-');

  documentation
    .build(`**/etl/${etl[0]}/${etl[1]}/**/transform.js`, {})
    .then(documentation.formats.md)
    .then(output => {
      fs.writeFileSync(
        path.resolve(`./docs/types/etls/${transform}.md`),
        output
      );
    });
});

// CLI documentation is inside the commands, which are basically placeholders.
documentation
  .build('tools/eubfr-cli/bin/*.js', { access: ['public'] })
  .then(comments => documentation.formats.md(comments, { markdownToc: true }))
  .then(output => {
    fs.writeFileSync(path.resolve('./tools/eubfr-cli/README.md'), output);
  });
