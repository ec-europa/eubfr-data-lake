# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="0.1.0"></a>
# 0.1.0 (2018-07-20)


### Bug Fixes

* **etl:** set directorates as reporting_organization values - EUBFR-193 ([#143](https://github.com/ec-europa/eubfr-data-lake/issues/143)) ([58a0f54](https://github.com/ec-europa/eubfr-data-lake/commit/58a0f54))


### Features

* **budget:** update etl - EUBFR-105 ([#70](https://github.com/ec-europa/eubfr-data-lake/issues/70)) ([973419e](https://github.com/ec-europa/eubfr-data-lake/commit/973419e))
* **docs:** add documentation based on flow - EUBFR-120 ([#73](https://github.com/ec-europa/eubfr-data-lake/issues/73)) ([350462e](https://github.com/ec-europa/eubfr-data-lake/commit/350462e))
* **elasticsearch:** improve mappings - EUBFR-88 ([#55](https://github.com/ec-europa/eubfr-data-lake/issues/55)) ([8a67c11](https://github.com/ec-europa/eubfr-data-lake/commit/8a67c11))
* **enrich-currency:** implement "enrich currency" process - EUBFR-184 ([#133](https://github.com/ec-europa/eubfr-data-lake/issues/133)) ([ce38952](https://github.com/ec-europa/eubfr-data-lake/commit/ce38952))
* **enrichment:** get nuts code from coordinates - EUBFR-115 ([#105](https://github.com/ec-europa/eubfr-data-lake/issues/105)) ([ddafeb5](https://github.com/ec-europa/eubfr-data-lake/commit/ddafeb5))
* **etl:** add Just ETL - INNO-151 ([#123](https://github.com/ec-europa/eubfr-data-lake/issues/123)) ([daad8e5](https://github.com/ec-europa/eubfr-data-lake/commit/daad8e5))
* **etl:** add missing fields AGRI ETL - EUBFR-118 ([#78](https://github.com/ec-europa/eubfr-data-lake/issues/78)) ([c0aae25](https://github.com/ec-europa/eubfr-data-lake/commit/c0aae25))
* **etl:** add poc for wifi4eu - EUBFR-153 ([#103](https://github.com/ec-europa/eubfr-data-lake/issues/103)) ([210ec3c](https://github.com/ec-europa/eubfr-data-lake/commit/210ec3c))
* **etl:** update location fields - EUBFR-100 ([#58](https://github.com/ec-europa/eubfr-data-lake/issues/58)) ([24d512b](https://github.com/ec-europa/eubfr-data-lake/commit/24d512b))
* **etl-currency:** sanitize currency codes - EUBFR-195 ([#139](https://github.com/ec-europa/eubfr-data-lake/issues/139)) ([70c5818](https://github.com/ec-europa/eubfr-data-lake/commit/70c5818))
* **geo-point:** add centroid to records - EUBFR-130 ([#82](https://github.com/ec-europa/eubfr-data-lake/issues/82)) ([2faf384](https://github.com/ec-europa/eubfr-data-lake/commit/2faf384))
* **iati:** init etl - EUBFR-162 ([#110](https://github.com/ec-europa/eubfr-data-lake/issues/110)) ([0e89369](https://github.com/ec-europa/eubfr-data-lake/commit/0e89369))
* **logger:** extend logger service with a messenger - EUBFR-122 ([#79](https://github.com/ec-europa/eubfr-data-lake/issues/79)) ([3feda55](https://github.com/ec-europa/eubfr-data-lake/commit/3feda55)), closes [#81](https://github.com/ec-europa/eubfr-data-lake/issues/81)
* **logging:** centralize logging for better reporting - EUBFR-92 ([#60](https://github.com/ec-europa/eubfr-data-lake/issues/60)) ([11524f1](https://github.com/ec-europa/eubfr-data-lake/commit/11524f1))
* **meta-index:** replace dynamodb with elasticsearch - EUBFR-104 ([#72](https://github.com/ec-europa/eubfr-data-lake/issues/72)) ([7f531e7](https://github.com/ec-europa/eubfr-data-lake/commit/7f531e7))
* **types:** add date precision fields - EUBFR-192 ([#140](https://github.com/ec-europa/eubfr-data-lake/issues/140)) ([0c5ff98](https://github.com/ec-europa/eubfr-data-lake/commit/0c5ff98))
* **value-store-projects:** save location as a geo_shape - EUBFR-98 ([#57](https://github.com/ec-europa/eubfr-data-lake/issues/57)) ([926a202](https://github.com/ec-europa/eubfr-data-lake/commit/926a202))