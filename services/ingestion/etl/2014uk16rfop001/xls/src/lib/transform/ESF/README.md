# 2014uk16rfop001 XLS ETL mapping rules

Funding type: ESF (European Social Fund)

Model to compare with is available at: https://ec-europa.github.io/eubfr-data-lake/

| Field                                                          | Target            |
| -------------------------------------------------------------- | ----------------- |
| Beneficiary Name                                               | third_parties     |
| Operation Name                                                 | title             |
| Operation Summary                                              | description       |
| Operation Start Date                                           | timeframe.from    |
| Operation End Date                                             | timeframe.to      |
| Total Eligible Expenditure Allocated to the Operation;Original |                   |
| Total Eligible Expenditure Allocated to the Operation;Current  | budget.total_cost |
| Union co‑financing rate, as per priority axis;                 | budget.eu_contrib |
| Operation postcode; or other appropriate location indicator;   | project_locations |
| Country                                                        | project_locations |
| Category of Intervention                                       | themes            |
| Last updated                                                   |                   |
