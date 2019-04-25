# DG 2014tc16m6tn001 XLS ETL mapping rules

Model to compare with is available at: https://ec-europa.github.io/eubfr-data-lake/

| Field                                                   | Target            |
| ------------------------------------------------------- | ----------------- |
| Programme's investment priority / thematic priority     | themes            |
| Programme & operation specific objective                | description       |
| Priority axis                                           | description       |
| Operation name                                          | title, project_id |
| Operation summary                                       | description       |
| Operation start date                                    | timeframe.from    |
| Operation end date                                      | timeframe.to      |
| Total eligible expenditure allocated to the operation   | budget.total_cost |
| Beneficiary name                                        | third_parties     |
| Beneficiary name in English                             | third_parties     |
| Total eligible expenditure allocated to the beneficiary |                   |
| Has the lead of the operation (Y/N)                     | third_parties     |
| Union co-financing rate in %                            | budget.eu_contrib |
