# Change Log

## 0.5.0 (2018-12-14)

#### :rocket: New Feature

- [#160](https://github.com/ec-europa/eubfr-data-lake/pull/160) feat(ingestion): make use of AWS Fargate as fallback of timeout in lambda handlers - EUBFR-204 ([@kalinchernev](https://github.com/kalinchernev))

#### :nail_care: Enhancement

- [#179](https://github.com/ec-europa/eubfr-data-lake/pull/179) chore(documentation-theme): update to ECL v2 - noissue ([@kalinchernev](https://github.com/kalinchernev))
- [#176](https://github.com/ec-europa/eubfr-data-lake/pull/176) refactor(cli): improve deployment workflows - EUBFR-146 ([@kalinchernev](https://github.com/kalinchernev))
- [#166](https://github.com/ec-europa/eubfr-data-lake/pull/166) refactor(budgetFormatter): ignore spaces between when abbreviations - EUBFR-214 ([@kalinchernev](https://github.com/kalinchernev))

#### Committers: 1

- Kalin Chernev ([@kalinchernev](https://github.com/kalinchernev))

## 0.4.1 (2018-11-28)

#### :rocket: New Feature

- [#168](https://github.com/ec-europa/eubfr-data-lake/pull/168) feat(etl): add data from DEVCO - EUBFR-217 ([@kalinchernev](https://github.com/kalinchernev))
- [#174](https://github.com/ec-europa/eubfr-data-lake/pull/174) feat(secrets-manager): improve workflows using AWS Secrets Manager service - EUBFR-224 ([@kalinchernev](https://github.com/kalinchernev))

#### :bug: Bug Fix

- [#172](https://github.com/ec-europa/eubfr-data-lake/pull/172) fix(etl): correct type field in BUDG ETL - EUBFR-220 ([@MrGRA](https://github.com/MrGRA))
- [#170](https://github.com/ec-europa/eubfr-data-lake/pull/170) fix(etl): correct type field in BUDG ETL - EUBFR-220 ([@MrGRA](https://github.com/MrGRA))

#### :nail_care: Enhancement

- [#175](https://github.com/ec-europa/eubfr-data-lake/pull/175) refactor(etls): change budg to eac and update mapping - EUBFR-222 ([@kalinchernev](https://github.com/kalinchernev))

#### Committers: 2

- Guilherme Almeida ([@MrGRA](https://github.com/MrGRA))
- Kalin Chernev ([@kalinchernev](https://github.com/kalinchernev))

## 0.3.1 (2018-11-08)

#### :bug: Bug Fix

- [#167](https://github.com/ec-europa/eubfr-data-lake/pull/167) fix(cordis): support fields for exceptional FP4 - EUBFR-215 ([@kalinchernev](https://github.com/kalinchernev))

#### Committers: 1

- Kalin Chernev ([@kalinchernev](https://github.com/kalinchernev))

## 0.3.0 (2018-10-12)

#### :rocket: New Feature

- [#159](https://github.com/ec-europa/eubfr-data-lake/pull/159) feat(etl): add title FTS - EUBFR-207 ([@kalinchernev](https://github.com/kalinchernev))
- [#158](https://github.com/ec-europa/eubfr-data-lake/pull/158) feat(etl): add FTS - EUBFR-202 ([@kalinchernev](https://github.com/kalinchernev))
- [#157](https://github.com/ec-europa/eubfr-data-lake/pull/157) feat(eubfr-cli): add features - EUBFR-205 ([@kalinchernev](https://github.com/kalinchernev))

#### :nail_care: Enhancement

- [#163](https://github.com/ec-europa/eubfr-data-lake/pull/163) refactor(budgetFormatter): improve work with monetary information - EUBFR-208 ([@kalinchernev](https://github.com/kalinchernev))
- [#164](https://github.com/ec-europa/eubfr-data-lake/pull/164) refactor(etl): update CORDIS producer to cover FP1 to FP7 on top of H2020 ([@kalinchernev](https://github.com/kalinchernev))
- [#161](https://github.com/ec-europa/eubfr-data-lake/pull/161) fix(etl): update transform function inforegio - EUBFR-208 ([@raduchiriac](https://github.com/raduchiriac))

#### Committers: 3

- Kalin Chernev ([@kalinchernev](https://github.com/kalinchernev))
- Radu Chiriac ([@raduchiriac](https://github.com/raduchiriac))
- Yannick Huard ([@yhuard](https://github.com/yhuard))

## 0.2.0 (2018-08-08)

#### :rocket: New Feature

- [#153](https://github.com/ec-europa/eubfr-data-lake/pull/153) feat(etl): add data from DG HOME - EUBFR-201 ([@kalinchernev](https://github.com/kalinchernev))
- [#145](https://github.com/ec-europa/eubfr-data-lake/pull/145) feat(etl): add cordis and H2020 - EUBFR-200 ([@raduchiriac](https://github.com/raduchiriac))

#### :boom: Breaking Change

- [#152](https://github.com/ec-europa/eubfr-data-lake/pull/152) feat(etl): add field for marking public information - EUBFR-154 ([@kalinchernev](https://github.com/kalinchernev))

#### :bug: Bug Fix

- [#155](https://github.com/ec-europa/eubfr-data-lake/pull/155) fix(etl): corrections in DG HOME - EUBFR-201 ([@kalinchernev](https://github.com/kalinchernev))

#### Committers: 2

- Kalin Chernev ([@kalinchernev](https://github.com/kalinchernev))
- Radu Chiriac ([@raduchiriac](https://github.com/raduchiriac))

## 0.1.1 (2018-07-31)

#### :bug: Bug Fix

- [#149](https://github.com/ec-europa/eubfr-data-lake/pull/149) fix(dashboard): correct query list files - EUBFR-185 ([@raduchiriac](https://github.com/raduchiriac))
- [#148](https://github.com/ec-europa/eubfr-data-lake/pull/148) fix(dashboard): refactor files query with a producer_id - EUBFR-196 ([@raduchiriac](https://github.com/raduchiriac))

#### :nail_care: Enhancement

- [#147](https://github.com/ec-europa/eubfr-data-lake/pull/147) fix(dashboard): correct query list files - EUBFR-185 ([@raduchiriac](https://github.com/raduchiriac))

#### :memo: Documentation

- [#150](https://github.com/ec-europa/eubfr-data-lake/pull/150) chore(valor): update mapping ([@degliwe](https://github.com/degliwe))

#### Committers: 2

- Radu Chiriac ([@raduchiriac](https://github.com/raduchiriac))
- wesley deglise ([@degliwe](https://github.com/degliwe))

<a name="0.1.0"></a>

# 0.1.0 (2018-07-20)

### Bug Fixes

- **dashboards:** use ECL v1 - EUBFR-171 ([#120](https://github.com/ec-europa/eubfr-data-lake/issues/120)) ([f9b9bf3](https://github.com/ec-europa/eubfr-data-lake/commit/f9b9bf3))
- **demo:** correct paths - EUBFR-152 ([#114](https://github.com/ec-europa/eubfr-data-lake/issues/114)) ([45772b0](https://github.com/ec-europa/eubfr-data-lake/commit/45772b0))
- **demo:** demo app improvements - EUBFR-80 ([#46](https://github.com/ec-europa/eubfr-data-lake/issues/46)) ([d078b1b](https://github.com/ec-europa/eubfr-data-lake/commit/d078b1b))
- **documentation-theme:** remove trash from markup - no issue ([#107](https://github.com/ec-europa/eubfr-data-lake/issues/107)) ([3a7185f](https://github.com/ec-europa/eubfr-data-lake/commit/3a7185f))
- **elasticsearch:** grant access to ES per lambda - EUBFR-142 ([#127](https://github.com/ec-europa/eubfr-data-lake/issues/127)) ([f848308](https://github.com/ec-europa/eubfr-data-lake/commit/f848308))
- **es-project-types:** add more types to ES "project" index - EUBFR-140 ([#94](https://github.com/ec-europa/eubfr-data-lake/issues/94)) ([296e1b5](https://github.com/ec-europa/eubfr-data-lake/commit/296e1b5))
- **etl:** add VALOR's project_id - EUBFR-111 ([#84](https://github.com/ec-europa/eubfr-data-lake/issues/84)) ([acfc5e7](https://github.com/ec-europa/eubfr-data-lake/commit/acfc5e7))
- **etl:** comply with new architecture - EUBFR-30 ([#13](https://github.com/ec-europa/eubfr-data-lake/issues/13)) ([32b1310](https://github.com/ec-europa/eubfr-data-lake/commit/32b1310))
- **etl:** fix budget recording - EUBFR-93 ([#56](https://github.com/ec-europa/eubfr-data-lake/issues/56)) ([c7ab36a](https://github.com/ec-europa/eubfr-data-lake/commit/c7ab36a))
- **etl:** fix location field name - EUBFR-78 ([#43](https://github.com/ec-europa/eubfr-data-lake/issues/43)) ([4b56add](https://github.com/ec-europa/eubfr-data-lake/commit/4b56add))
- **etl:** set directorates as reporting_organization values - EUBFR-193 ([#143](https://github.com/ec-europa/eubfr-data-lake/issues/143)) ([58a0f54](https://github.com/ec-europa/eubfr-data-lake/commit/58a0f54))
- **iati-etl:** change value for budget as well - EUBFR-162 ([#119](https://github.com/ec-europa/eubfr-data-lake/issues/119)) ([c1ad582](https://github.com/ec-europa/eubfr-data-lake/commit/c1ad582))
- **iati-etl:** consider two values - EUBFR-173 ([#122](https://github.com/ec-europa/eubfr-data-lake/issues/122)) ([9bfda23](https://github.com/ec-europa/eubfr-data-lake/commit/9bfda23))
- **iati-etl:** upload transformed data at once - noissue ([#117](https://github.com/ec-europa/eubfr-data-lake/issues/117)) ([02b9540](https://github.com/ec-europa/eubfr-data-lake/commit/02b9540))
- **iati-etl:** use expenditure rather than commitment - EUBFR-162 ([#118](https://github.com/ec-europa/eubfr-data-lake/issues/118)) ([07c8aa0](https://github.com/ec-europa/eubfr-data-lake/commit/07c8aa0))
- **packages:** add missing dependency - no issue ([400332e](https://github.com/ec-europa/eubfr-data-lake/commit/400332e))
- **permissions:** grant permissions to enrichment process - no issue ([#101](https://github.com/ec-europa/eubfr-data-lake/issues/101)) ([d50cf5c](https://github.com/ec-europa/eubfr-data-lake/commit/d50cf5c))
- **plugins:** move lib folder - no issue ([#67](https://github.com/ec-europa/eubfr-data-lake/issues/67)) ([cc35000](https://github.com/ec-europa/eubfr-data-lake/commit/cc35000))
- **scripts:** correct deletion scripts - noissue ([#91](https://github.com/ec-europa/eubfr-data-lake/issues/91)) ([a3c4d95](https://github.com/ec-europa/eubfr-data-lake/commit/a3c4d95)), closes [#93](https://github.com/ec-europa/eubfr-data-lake/issues/93)
- **signed-uploads:** correct cloud formation configurations - no issue ([#20](https://github.com/ec-europa/eubfr-data-lake/issues/20)) ([f5c2005](https://github.com/ec-europa/eubfr-data-lake/commit/f5c2005))

### Features

- **acl:** allow only users from specific groups - EUBFR-36 ([#21](https://github.com/ec-europa/eubfr-data-lake/issues/21)) ([93e56fd](https://github.com/ec-europa/eubfr-data-lake/commit/93e56fd))
- **budget:** update etl - EUBFR-105 ([#70](https://github.com/ec-europa/eubfr-data-lake/issues/70)) ([973419e](https://github.com/ec-europa/eubfr-data-lake/commit/973419e))
- **dashboard:** visual identity - EUBFR-71 ([#42](https://github.com/ec-europa/eubfr-data-lake/issues/42)) ([a93607e](https://github.com/ec-europa/eubfr-data-lake/commit/a93607e))
- **delete-objects:** add "delete object" functionality - EUBFR-50 ([#31](https://github.com/ec-europa/eubfr-data-lake/issues/31)) ([74c0e80](https://github.com/ec-europa/eubfr-data-lake/commit/74c0e80))
- **deleter:** automatic tear down - EUBFR-83 ([#49](https://github.com/ec-europa/eubfr-data-lake/issues/49)) ([fa7855a](https://github.com/ec-europa/eubfr-data-lake/commit/fa7855a))
- **deleter:** protect staging environments - no issue ([#54](https://github.com/ec-europa/eubfr-data-lake/issues/54)) ([34fdb1e](https://github.com/ec-europa/eubfr-data-lake/commit/34fdb1e))
- **demo:** initiate the demo - noissue ([#24](https://github.com/ec-europa/eubfr-data-lake/issues/24)) ([7e6a45c](https://github.com/ec-europa/eubfr-data-lake/commit/7e6a45c)), closes [#23](https://github.com/ec-europa/eubfr-data-lake/issues/23) [#22](https://github.com/ec-europa/eubfr-data-lake/issues/22)
- **demo-website:** add simple page showing projects - EUBFR-46 ([#26](https://github.com/ec-europa/eubfr-data-lake/issues/26)) ([3547b6f](https://github.com/ec-europa/eubfr-data-lake/commit/3547b6f)), closes [#23](https://github.com/ec-europa/eubfr-data-lake/issues/23) [#22](https://github.com/ec-europa/eubfr-data-lake/issues/22) [#25](https://github.com/ec-europa/eubfr-data-lake/issues/25)
- **docs:** add documentation based on flow - EUBFR-120 ([#73](https://github.com/ec-europa/eubfr-data-lake/issues/73)) ([350462e](https://github.com/ec-europa/eubfr-data-lake/commit/350462e))
- **docs:** add specs for Valor/EAC/xls etl - EUBFR-111 ([#74](https://github.com/ec-europa/eubfr-data-lake/issues/74)) ([b5bebc9](https://github.com/ec-europa/eubfr-data-lake/commit/b5bebc9))
- **dynamo-autoscale:** scale Dynamo capacity dynamically - EUBFR-25 ([#12](https://github.com/ec-europa/eubfr-data-lake/issues/12)) ([df81799](https://github.com/ec-europa/eubfr-data-lake/commit/df81799))
- **elasticsearch:** improve mappings - EUBFR-88 ([#55](https://github.com/ec-europa/eubfr-data-lake/issues/55)) ([8a67c11](https://github.com/ec-europa/eubfr-data-lake/commit/8a67c11))
- **elasticsearch:** restrict methods - EUBFR-137 ([#96](https://github.com/ec-europa/eubfr-data-lake/issues/96)) ([e694b72](https://github.com/ec-europa/eubfr-data-lake/commit/e694b72))
- **enrich-currency:** implement "enrich currency" process - EUBFR-184 ([#133](https://github.com/ec-europa/eubfr-data-lake/issues/133)) ([ce38952](https://github.com/ec-europa/eubfr-data-lake/commit/ce38952))
- **enrichment:** build enrichment PoC - EUBFR-126 ([#85](https://github.com/ec-europa/eubfr-data-lake/issues/85)) ([14db195](https://github.com/ec-europa/eubfr-data-lake/commit/14db195))
- **enrichment:** get data from gisco - EUBFR-113 ([#88](https://github.com/ec-europa/eubfr-data-lake/issues/88)) ([7c237f2](https://github.com/ec-europa/eubfr-data-lake/commit/7c237f2))
- **enrichment:** get nuts code from coordinates - EUBFR-115 ([#105](https://github.com/ec-europa/eubfr-data-lake/issues/105)) ([ddafeb5](https://github.com/ec-europa/eubfr-data-lake/commit/ddafeb5))
- **enrichment-fields-budget:** use time precision - EUBFR-198 ([#142](https://github.com/ec-europa/eubfr-data-lake/issues/142)) ([0ce6c2b](https://github.com/ec-europa/eubfr-data-lake/commit/0ce6c2b))
- **es-id:** provide ES IDs for projects - EUBFR-125 ([#83](https://github.com/ec-europa/eubfr-data-lake/issues/83)) ([504ab9a](https://github.com/ec-europa/eubfr-data-lake/commit/504ab9a))
- **etl:** add inforegio json etl - EUBFR-47 ([#27](https://github.com/ec-europa/eubfr-data-lake/issues/27)) ([d200107](https://github.com/ec-europa/eubfr-data-lake/commit/d200107))
- **etl:** add Just ETL - INNO-151 ([#123](https://github.com/ec-europa/eubfr-data-lake/issues/123)) ([daad8e5](https://github.com/ec-europa/eubfr-data-lake/commit/daad8e5))
- **etl:** add missing fields AGRI ETL - EUBFR-118 ([#78](https://github.com/ec-europa/eubfr-data-lake/issues/78)) ([c0aae25](https://github.com/ec-europa/eubfr-data-lake/commit/c0aae25))
- **etl:** add poc for wifi4eu - EUBFR-153 ([#103](https://github.com/ec-europa/eubfr-data-lake/issues/103)) ([210ec3c](https://github.com/ec-europa/eubfr-data-lake/commit/210ec3c))
- **etl:** add xls etl -EUBFR-37 ([#19](https://github.com/ec-europa/eubfr-data-lake/issues/19)) ([f6c55c2](https://github.com/ec-europa/eubfr-data-lake/commit/f6c55c2))
- **etl:** add xml etl - EUBFR-90 ([#62](https://github.com/ec-europa/eubfr-data-lake/issues/62)) ([87207b1](https://github.com/ec-europa/eubfr-data-lake/commit/87207b1))
- **etl:** comply with the expected output json - EUBFR-22 ([#8](https://github.com/ec-europa/eubfr-data-lake/issues/8)) ([09e4afb](https://github.com/ec-europa/eubfr-data-lake/commit/09e4afb))
- **etl:** fix date format - EUBFR-77 ([#44](https://github.com/ec-europa/eubfr-data-lake/issues/44)) ([e1fcee5](https://github.com/ec-europa/eubfr-data-lake/commit/e1fcee5))
- **etl:** update location fields - EUBFR-100 ([#58](https://github.com/ec-europa/eubfr-data-lake/issues/58)) ([24d512b](https://github.com/ec-europa/eubfr-data-lake/commit/24d512b))
- **etl-currency:** sanitize currency codes - EUBFR-195 ([#139](https://github.com/ec-europa/eubfr-data-lake/issues/139)) ([70c5818](https://github.com/ec-europa/eubfr-data-lake/commit/70c5818))
- **etl-results:** report ETL results - EUBFR-57 ([#36](https://github.com/ec-europa/eubfr-data-lake/issues/36)) ([4ffaa88](https://github.com/ec-europa/eubfr-data-lake/commit/4ffaa88))
- **eubfr-cli:** bootstrap cli utility - EUBFR-176 ([#138](https://github.com/ec-europa/eubfr-data-lake/issues/138)) ([db6075e](https://github.com/ec-europa/eubfr-data-lake/commit/db6075e))
- **facade:** model and implement facade for s3 proxy - EUBFR-12 ([#6](https://github.com/ec-europa/eubfr-data-lake/issues/6)) ([9464842](https://github.com/ec-europa/eubfr-data-lake/commit/9464842))
- **facade:** refactoring - EUBFR-14 ([#9](https://github.com/ec-europa/eubfr-data-lake/issues/9)) ([b2f0d9b](https://github.com/ec-europa/eubfr-data-lake/commit/b2f0d9b))
- **geo-point:** add centroid to records - EUBFR-130 ([#82](https://github.com/ec-europa/eubfr-data-lake/issues/82)) ([2faf384](https://github.com/ec-europa/eubfr-data-lake/commit/2faf384))
- **iati:** init etl - EUBFR-162 ([#110](https://github.com/ec-europa/eubfr-data-lake/issues/110)) ([0e89369](https://github.com/ec-europa/eubfr-data-lake/commit/0e89369))
- **ingestion:** react to S3 events - EUBFR-20 ([#5](https://github.com/ec-europa/eubfr-data-lake/issues/5)) ([43ee96a](https://github.com/ec-europa/eubfr-data-lake/commit/43ee96a))
- **ingestion-manager:** dynamically call producer's SNS topic - EUBFR-45 ([#22](https://github.com/ec-europa/eubfr-data-lake/issues/22)) ([556c89a](https://github.com/ec-europa/eubfr-data-lake/commit/556c89a))
- **ingestion-quality-analyzer:** init service - EUBFR-166 ([#121](https://github.com/ec-europa/eubfr-data-lake/issues/121)) ([11e98cd](https://github.com/ec-europa/eubfr-data-lake/commit/11e98cd))
- **instance-stopper:** initiate service - EUBFR-189 ([#136](https://github.com/ec-europa/eubfr-data-lake/issues/136)) ([7828c73](https://github.com/ec-europa/eubfr-data-lake/commit/7828c73))
- **logger:** extend logger service with a messenger - EUBFR-122 ([#79](https://github.com/ec-europa/eubfr-data-lake/issues/79)) ([3feda55](https://github.com/ec-europa/eubfr-data-lake/commit/3feda55)), closes [#81](https://github.com/ec-europa/eubfr-data-lake/issues/81)
- **logging:** centralize logging for better reporting - EUBFR-92 ([#60](https://github.com/ec-europa/eubfr-data-lake/issues/60)) ([11524f1](https://github.com/ec-europa/eubfr-data-lake/commit/11524f1))
- **mappings:** add keyword feature on title - no issue ([#68](https://github.com/ec-europa/eubfr-data-lake/issues/68)) ([4452269](https://github.com/ec-europa/eubfr-data-lake/commit/4452269))
- **meta-index:** add meta index - EUBFR-28 ([#11](https://github.com/ec-europa/eubfr-data-lake/issues/11)) ([12397aa](https://github.com/ec-europa/eubfr-data-lake/commit/12397aa))
- **meta-index:** replace dynamodb with elasticsearch - EUBFR-104 ([#72](https://github.com/ec-europa/eubfr-data-lake/issues/72)) ([7f531e7](https://github.com/ec-europa/eubfr-data-lake/commit/7f531e7))
- **projects:** save results in DynamoDB - EUBFR-32 ([#14](https://github.com/ec-europa/eubfr-data-lake/issues/14)) ([13a3808](https://github.com/ec-europa/eubfr-data-lake/commit/13a3808))
- **projects-count:** display the right projects count - EUBFR-87 ([#51](https://github.com/ec-europa/eubfr-data-lake/issues/51)) ([2640bf4](https://github.com/ec-europa/eubfr-data-lake/commit/2640bf4))
- **reports:** display quality information - EUBFR-175 ([#130](https://github.com/ec-europa/eubfr-data-lake/issues/130)) ([525a1a4](https://github.com/ec-europa/eubfr-data-lake/commit/525a1a4))
- **resources:** optimise dev development time - EUBFR-102 ([#63](https://github.com/ec-europa/eubfr-data-lake/issues/63)) ([2b6427e](https://github.com/ec-europa/eubfr-data-lake/commit/2b6427e))
- **save-to-db:** save records to DynamoDB - EUBFR-21 ([#7](https://github.com/ec-europa/eubfr-data-lake/issues/7)) ([5a14ed1](https://github.com/ec-europa/eubfr-data-lake/commit/5a14ed1))
- **serverless-plugin-elasticsearch-index:** add plugin - EUBFR-101 ([#64](https://github.com/ec-europa/eubfr-data-lake/issues/64)) ([4775c3c](https://github.com/ec-europa/eubfr-data-lake/commit/4775c3c)), closes [#65](https://github.com/ec-europa/eubfr-data-lake/issues/65)
- **types:** add date precision fields - EUBFR-192 ([#140](https://github.com/ec-europa/eubfr-data-lake/issues/140)) ([0c5ff98](https://github.com/ec-europa/eubfr-data-lake/commit/0c5ff98))
- **types:** add types via flow - EUBFR-72 ([#45](https://github.com/ec-europa/eubfr-data-lake/issues/45)) ([a290858](https://github.com/ec-europa/eubfr-data-lake/commit/a290858))
- **ui:** add "file info" page on demo - EUBFR-58 ([#37](https://github.com/ec-europa/eubfr-data-lake/issues/37)) ([4f6bb5a](https://github.com/ec-europa/eubfr-data-lake/commit/4f6bb5a))
- **update-doc:** add update functionality - EUBFR-51 ([#33](https://github.com/ec-europa/eubfr-data-lake/issues/33)) ([5f4e086](https://github.com/ec-europa/eubfr-data-lake/commit/5f4e086))
- **upload-form:** add disclaimer - EUBFR-53 ([#34](https://github.com/ec-europa/eubfr-data-lake/issues/34)) ([17111d8](https://github.com/ec-europa/eubfr-data-lake/commit/17111d8))
- **upload-form:** make form looks better - EUBFR-54 ([#35](https://github.com/ec-europa/eubfr-data-lake/issues/35)) ([c6c964e](https://github.com/ec-europa/eubfr-data-lake/commit/c6c964e))
- **value-store:** populate producer_id field - EUBFR-190 ([#134](https://github.com/ec-europa/eubfr-data-lake/issues/134)) ([6cf7f71](https://github.com/ec-europa/eubfr-data-lake/commit/6cf7f71))
- **value-store-projects:** save location as a geo_shape - EUBFR-98 ([#57](https://github.com/ec-europa/eubfr-data-lake/issues/57)) ([926a202](https://github.com/ec-europa/eubfr-data-lake/commit/926a202))
