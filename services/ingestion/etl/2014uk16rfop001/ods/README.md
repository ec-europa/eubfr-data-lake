# 2014uk16rfop001 XLS ETL mapping rules

Model to compare with is available at: https://ec-europa.github.io/eubfr-data-lake/

| Field                                            | Target                  |
| ------------------------------------------------ | ----------------------- |
| Name of beneficiary                              | third_parties           |
| Beneficiary identifier (E-claims ref)            | description             |
| Type of enterprise (drop down)                   |                         |
| Location of Benficiary NUTS level II (drop down) | project_locations       |
| Sector NACE group level                          | description             |
| Aid element £                                    | budget.total_cost       |
| Aid instrument (drop down)                       |                         |
| Date of granting                                 | timeframe.from          |
| Objective of the aid                             | description, project_id |
| Granting authority                               |                         |
| SANI reference of the aid measure                | description             |
