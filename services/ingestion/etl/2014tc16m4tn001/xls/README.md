# 2014tc16m4tn001 XLS ETL mapping rules

Model to compare with is available at: https://ec-europa.github.io/eubfr-data-lake/

| Field                                                    | Target                           |
| -------------------------------------------------------- | -------------------------------- |
| Axis                                                     | description                      |
| Objective                                                | description                      |
| Acronym                                                  | description                      |
| Project label                                            | title                            |
| Operation summary                                        | description                      |
| Lead Partner                                             | third_parties                    |
| Country                                                  | project_locations, third_parties |
| Postcode                                                 | project_locations                |
| Call for proposals                                       | description                      |
| Start date                                               | timeframe.from                   |
| End date                                                 | timeframe.to                     |
| Type of project                                          | type                             |
| ERDF                                                     | description                      |
| IPA Funds                                                | description                      |
| Amount of the project (ERDF +IPA + national counterpart) | budget.total_cost                |
| Co financing rate                                        | budget.eu_contrib                |
