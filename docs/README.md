# Documentation

## General

* [Getting Started](./GETTING_STARTED.md)
* [Architecture](./ARCHITECTURE.md)
* [How to test](./HOW_TO_TEST.md)
* [Pushing data](./PUSHING_DATA.md)

## Cookbook

Re-use working [example Elasticsearch queries](./cookbook/README.md).

## Types

The `Project` model is central for the data lake. All ETLs should comply with the [EUBFR types](./types/README.md) in order to store data throughout consistently.

To generate documentation:

* `yarn docs:md` for markdown version in `docs/types/etl`

## Data enrichment

When data is ingested, an `enrichment manager` calls various data enrichment plugins in order to include additional information which hasn't been initially available.

[Detailed information about the enrichment processes](./enrichment/README.md).

## Troubleshooting

Common issues are documented in our [Troubleshooting](./TROUBLESHOOTING.md) guide.
