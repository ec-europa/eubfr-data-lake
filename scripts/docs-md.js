const fs = require('fs');
const path = require('path');
const documentation = require('documentation'); // eslint-disable-line import/no-extraneous-dependencies

documentation
  .build('**/_types/Project.js', {})
  .then(documentation.formats.md)
  .then(output => {
    fs.writeFileSync(path.resolve('./docs/types/Project.md'), output);
  });

const transforms = [
  'agri-csv',
  'budg-xls',
  'inforegio-json',
  'inforegio-xml',
  'valor-xls',
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
