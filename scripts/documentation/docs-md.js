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
  '2014tc16i5cb005-csv',
  '2014tc16m4tn002-xls',
  '2014tc16rfcb014-csv',
  '2014tc16rfpc001-xls',
  '2014tc16rftn002-xls',
  'bulgaria-xls',
  'cordis-csv',
  'devco-xls',
  'eac-csv',
  'euinvest-csv',
  'euresults-csv',
  'fts-xls',
  'home-xls',
  'iati-csv',
  'inforegio-json',
  'inforegio-xml',
  'just-csv',
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
    })
    .catch(e => {
      console.log('There was an issue while generating documentation', e);
    });
});

// CLI documentation is inside the commands, which are basically placeholders.
documentation
  // Shallow is required because the cli tries to import config.json in lib yet.
  // Try/catch does not help, and since there are no deep dependencies it's ok for now.
  .build('tools/eubfr-cli/bin/*.js', {
    access: ['public'],
    // Sort in markdown TOC does not work because of this https://github.com/documentationjs/documentation/issues/615
    shallow: true,
  })
  .then(comments => documentation.formats.md(comments, { markdownToc: true }))
  .then(output => {
    fs.writeFileSync(path.resolve('./tools/eubfr-cli/README.md'), output);
  })
  .catch(e => {
    console.log('There was an issue while generating documentation', e);
  });
