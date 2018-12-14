# Development

EUBFR CLI aims to be a helper utility simplifying repetiive day-to-day actions you would take as a developer. Commands avaible in the CLI cover all functionalities available through web UIs so that you can manage content for the ingestion workflows.

In addition, the CLI covers many additional features which came handy during development and maintenance of the project. And because the CLI is mainly targeting developers and automation systems as a user base, this document outlines a general overview of main concepts from the perspective of the developer who would use the tool.

## Background

The current implementation of this CLI utility is built upon [commander](https://www.npmjs.com/package/commander).
In order to keep code maintainable, each manageable resource in terms of EUBFR as a project is translated to a separate CLI executable using this [feature of commander](https://www.npmjs.com/package/commander#git-style-sub-commands).

## Files overview

Here how the most important concepts are organized:

```sh
└── eubfr-cli
    ├── bin                             <---- place for separate executables
    │   ├── cli.js
    │   ├── eubfr-cli-content.js
    │   ├── eubfr-cli-demo.js
    ...
    ├── commands                        <---- place for command implementations
    │   ├── content
    │   │   ├── delete.js
    │   │   ├── show.js
    │   │   └── upload.js
    │   ├── demo
    │   │   ├── delete.js
    │   │   └── deploy.js
    ...
    ├── docs                            <---- place for documentation
    ├── lib                             <---- place for reusable logic
    └── README.md                       <---- automatically generated documentation
```

## Source in details

If the overview above is not enough, here's a more detailed walkthrough.

### Separate executables are `commander`-specific files acting like standalone CLI applications

For instance, the following two are totally the same things:

```sh
$ eubfr-cli content upload -h
```

and

```sh
$ ./tools/eubfr-cli/bin/eubfr-cli-content.js upload -h
```

Each command contains several target sub-commands managing the given resource. For instance `eubfr-cli content` provides `upload`, `show` and `delete`.

### The files in `/tools/eubfr-cli/commands` are high-level wrappers on top of commands

They map the `commander`' command declaration to the functionality of their target resource management. For instance, `eubfr-cli content upload` maps to function `uploadFiles` contained in `/tools/eubfr-cli/commands/content/upload.js`. Each command runs one function and each function is contained within one file.

Command files in `/tools/eubfr-cli/commands` call external APIs, such as Elasticsearch and AWS, as well as they emulate execution of other CLIs, such as `yarn` and `serverless`.

### Reusable logic is contained within `/tools/eubfr-cli/lib`

Although `/tools/eubfr-cli/commands` should be self-sufficient, tasks such as service deletion could be shared between deleting an ingestion service and a demo service, for example. When this is the case, service calls and shell emulation is allowed to be moved down in the specific helper.

Alaways aim to keep shell emulation and service calls in `/tools/eubfr-cli/commands` layer.

## Documentation

The `README.md` file in the root of the `eubfr-cli` package is updated automatically by running `yarn docs:md` from the root of the EUBFR project. The contents of this file is aggregated from executables' (`/tools/eubfr-cli/bin/*`)
