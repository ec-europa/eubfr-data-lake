# EUBFR CLI

## Usage

```sh
$ npx eubfr-cli
```

If you want to make use of the CLI to automatically upload or delete all content of a given stage, you can optionally create a `.content` folder in the root of your project, with the following example structure:

```
.
├── agri
│   ├── agri_history2.csv
│   ├── agri_history3.csv
│   ├── agri_history4.csv
│   └── agri_history.csv
├── budg
│   └── CreativeEurope_Projects_Overview_2017-08-21.xls
├── iati
│   ├── activity.csv
│   ├── activity_large.csv
│   └── activity_sample.csv
├── inforegio
│   ├── EUBFR_VIEW_16052018.xml
│   ├── regio_projects-enr.xml
│   ├── regio_projects.json
│   └── regio_projects.xml
├── valor
│   └── valor_sample.xls
└── wifi4eu
    └── wifi4euRegistrations.xlsx
```

Then either run `yarn content:upload` to upload of that content to their respective S3 buckets which trigger the ingestion process for each producer, or run `yarn content:delete` to delete all the currently uploaded content of a given stage.

You will need to have the `config.json` file correctly setup in the root folder of the project, as producers' credentials are currently stored only there in the existing workflows.
