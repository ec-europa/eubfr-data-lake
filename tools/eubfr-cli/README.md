# EUBFR CLI

Low-level utilities for managing assets of EUBFR data lake.

## Usage

```sh
$ npx eubfr-cli
```

If you want to make use of the CLI to automatically upload or delete all content of a given stage, you can optionally create a `.content` folder in the root of your project, with the following example structure:

```
.
├── agri
│   └── agri_history.csv
├── budg
│   └── CreativeEurope_Projects_Overview_2017-08-21.xls
├── iati
│   └── activity.csv
├── inforegio
│   ├── EUBFR_VIEW_16052018.xml
│   └── regio_projects.json
├── valor
│   └── valor_sample.xls
└── wifi4eu
    └── wifi4euRegistrations.xlsx
```

There are 2 abstracted operations on a project level:

- `yarn content:upload` uploads files from `.content` producers' folders to their respective S3 buckets in the cloud. This triggers the ingestion process.
- `yarn content:delete` deletes all the currently uploaded content of all producers, for a given stage.

Note that you will need to have the `config.json` file correctly setup in the root folder of the project, as producers' credentials are currently stored only there in the existing workflows.

### Examples

#### Upload content

- Single file: `npx eubfr-cli upload .content/agri/agri_history.csv -p agri`
- Multiple files: `npx eubfr-cli upload .content/inforegio/EUBFR_VIEW_16052018.xml .content/inforegio/regio_projects.json -p inforegio`
- All files: `npx eubfr-cli upload`

Please note that although input paths are relative, only file names will be kept in the cloud. This means that, although you pass `.content/agri/agri_history.csv`, file name in the S3 bucket of AGRI will receive `agri_history.csv`.

#### Show existing content

- specific file by `computed_key`: `npx eubfr-cli show agri/16598a36-db86-42a0-8041-c0d85021ad97.csv`
- all files of a given producer: `npx eubfr-cli show -p agri`

#### Delete content

- delete one or multiple files: `npx eubfr-cli delete agri/foo budg/bar inforegio/baz`
- delete all files of all producers `npx eubfr-cli delete`

Please be careful with this operation, there is no confirmation because having CLI assumes you know what you're doing with it.
There's no need to pass `--producer` flag here because it's deducted by the `computed_key` passed.
