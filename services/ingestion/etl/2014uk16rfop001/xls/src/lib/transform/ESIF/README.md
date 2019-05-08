# 2014uk16rfop001 XLS ETL mapping rules

Funding type: ESIF (EUROPEAN STRUCTURAL AND INVESTMENT FUNDS)

Model to compare with is available at: https://ec-europa.github.io/eubfr-data-lake/

| Field                                                  | Target            |
| ------------------------------------------------------ | ----------------- |
| Recipient of funds                                     | third_parties     |
| Name of Project                                        | title             |
| Type of fund                                           | description       |
| Priority Axis                                          | description       |
| Summary of project (max 100 words)                     | description       |
| Start date                                             | timeframe.from    |
| End date                                               | timeframe.to      |
| ERDF/ESF investment £m                                 | budget.eu_contrib |
| Total project costs £m                                 | budget.total_cost |
| % of project funded by EU                              |                   |
| Location (postcode)                                    | project_locations |
| Local Enterprise Partnership area                      | project_locations |
| Country                                                | project_locations |
| Type and focus of support (_Category of intervention)_ | themes            |
