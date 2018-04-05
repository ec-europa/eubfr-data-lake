# Documentation

## General

* [Getting Started](./GETTING_STARTED.md)
* [Architecture](./ARCHITECTURE.md)
* [How to test](./HOW_TO_TEST.md)
* [Pushing data](./PUSHING_DATA.md)
* [Data Availability](./DATA_AVAILABILITY.md)

## Cookbook

Re-use working [example Elasticsearch queries](./cookbook/README.md).

## Types

The `Project` model is central for the data lake. All ETLs should comply with the [EUBFR types](./types/README.md) in order to store data throughout consistently.

To generate documentation:

* `yarn docs:md` for markdown version in `docs/types/etl`

## Troubleshooting

Common issues are documented in our [Troubleshooting](./TROUBLESHOOTING.md) guide.
