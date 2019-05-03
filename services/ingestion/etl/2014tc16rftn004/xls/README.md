# 2014tc16rftn004 XLS ETL mapping rules

Model to compare with is available at: https://ec-europa.github.io/eubfr-data-lake/

| Field                                                   | Target                           |
| ------------------------------------------------------- | -------------------------------- |
| Programme's investment priority / thematic priority     | themes                           |
| Programme & operation specific objective                | description                      |
| Priority axis                                           | description                      |
| Operation name                                          | title                            |
| Operation summary                                       | description                      |
| Operation start date                                    | timeframe.from                   |
| Operation end date                                      | timeframe.to                     |
| Total eligible expenditure allocated to the operation   | budget.total_cost                |
| Beneficiary name                                        | third_parties                    |
| Beneficiary name in English                             | third_parties                    |
| Total eligible expenditure allocated to the beneficiary |                                  |
| Has the lead of the operation (Y/N)                     | third_parties                    |
| Union co-financing rate in %                            | budget.eu_contrib                |
| Operation postcode                                      | project_locations                |
| Town                                                    | project_locations                |
| NUTS1                                                   | project_locations                |
| NUTS2                                                   | project_locations                |
| NUTS3                                                   | project_locations                |
| Country                                                 | third_parties, project_locations |
