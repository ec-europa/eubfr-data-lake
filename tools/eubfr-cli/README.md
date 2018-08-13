- [EUBFR CLI](#eubfr-cli)
  - [Usage](#usage)
  - [Generate environment variables](#generate-environment-variables)
  - [Content management](#content-management)
    - [Upload content](#upload-content)
    - [Show existing content](#show-existing-content)
    - [Delete content](#delete-content)
  - [Elasticsearch](#elasticsearch)
    - [Show domains](#show-domains)
    - [Show cluster information](#show-cluster-information)
    - [Show list of indices under a given domain](#show-list-of-indices-under-a-given-domain)

# EUBFR CLI

Low-level utilities for managing assets of EUBFR data lake.

## Usage

```sh
$ npx eubfr-cli
```

## Generate environment variables

That's probably the first operation you'd like to execute:

```sh
$ npx eubfr-cli environment-generate-variables
```

This will generate `.env` files for all services which contain variable exports which are necessary for the proper functioning of the CLI.

For instance, you may try to get information about available Elasticsearch domains which are manageable by the CLI running `npx eubfr-cli es-domains`.

If you haven't deployed `@eubfr/demo-dashboard-client` or you have switched between staging environments working on different branches at the same code base, then you'll get an error like this:

```
ENOENT: no such file or directory, open '.../eubfr-data-lake/demo/dashboard/client/.env'
```

Or it could be also any other message that hints for a requirement of a given named environment variable, such as `SIGNED_UPLOADS_API`.

These are signs that you need to re-generate all necessary `.env` files which contain information for the API endpoints.

## Content management

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

### Upload content

- Single file: `npx eubfr-cli content-upload .content/agri/agri_history.csv -p agri`
- Multiple files: `npx eubfr-cli content-upload .content/inforegio/EUBFR_VIEW_16052018.xml .content/inforegio/regio_projects.json -p inforegio`
- All files: `npx eubfr-cli content-upload`

Please note that although input paths are relative, only file names will be kept in the cloud. This means that, although you pass `.content/agri/agri_history.csv`, file name in the S3 bucket of AGRI will receive `agri_history.csv`.

### Show existing content

- specific file by `computed_key`: `npx eubfr-cli show agri/16598a36-db86-42a0-8041-c0d85021ad97.csv`
- all files of a given producer: `npx eubfr-cli content-show -p agri`

### Delete content

- delete one or multiple files: `npx eubfr-cli content-delete agri/foo budg/bar inforegio/baz`
- delete all files of all producers `npx eubfr-cli content-delete`

By default, you will be prompted to confirm your intention. You can skip the this prompt by adding `--confirm` flag.

## Elasticsearch

You can also manage several resources of the Elasticsearch domains being used by the project.

### Show domains

Useful when you want to see the names of the Elasticsearch domains available for management throught the EUBFR CLI

```sh
npx eubfr-cli es-domains
```

This will give you information about the named environment variables holding information about their corresponding hosts. (API endpoints)

### Show cluster information

Once you have the basic information about the domains you can manage through the CLI, you can execute the following:

```sh
npx eubfr-cli es-show-cluster -d ES_PUBLIC_ENDPOINT
```

Where `ES_PUBLIC_ENDPOINT` is something you can get from the domains' information command.

### Show list of indices under a given domain

This could be useful when you want to query for existing indices so that you either re-use or re-create:

```sh
npx eubfr-cli es-indices -d ES_PUBLIC_ENDPOINT
```

Since output might be too long to read (and most probably it will be in `dev` stage which is shared between developers), it could help to pipe a `grep` in order to focus on more narrow list, for example:

```sh
npx eubfr-cli es-indices -d ES_PUBLIC_ENDPOINT | grep chernka
```

This will give you a list of existing indices created by the given user.
