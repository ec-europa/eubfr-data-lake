# 2014tc16rfcb021 XLS ETL mapping rules

Model to compare with is available at: https://ec-europa.github.io/eubfr-data-lake/

| Field                             | Target                           |
| --------------------------------- | -------------------------------- |
| Ranking                           | description                      |
| Project code                      | description                      |
| e-MS code                         | project_id                       |
| Project title                     | title                            |
| Objectives                        | description                      |
| Duration                          | description                      |
| Start date                        | timeframe.from                   |
| End date                          | timeframe.to                     |
| Status                            | status                           |
| Lead beneficiary/ beneficiary/ies | third_parties                    |
| Country                           | third_parties, project_locations |
| County/District                   | third_parties, project_locations |
| Category of intervention          | description                      |
| Approved budget                   | budget.total_cost                |
| Community Funding ERDF(euro)      | budget.eu_contrib                |
| Percent (ERDF)                    | description                      |
| National co-financing(euro)       | description                      |
| Percent (National co-financing)   | description                      |
| Own Contribution (euro)           | description                      |
| Percent (Own Contributions)       | description                      |
