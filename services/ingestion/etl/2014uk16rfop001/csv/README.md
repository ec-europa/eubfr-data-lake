# 2014uk16rfop001 CSV ETL mapping rules

Model to compare with is available at: https://ec-europa.github.io/eubfr-data-lake/

| Field                                                | Target            |
| ---------------------------------------------------- | ----------------- |
| Recipient of funds(ERDF/ESF beneficiary)             | third_parties     |
| Name of project                                      | title             |
| Type of fund                                         | type              |
| Summary of project(max 100 words)                    | description       |
| Start date                                           | timeframe.from    |
| End date                                             | timeframe.to      |
| ERDF/ESF investment �m                               |                   |
| Total project costs �m (eligible project costs only) | budget.total_cost |
| % of project funded by EU (Co-financing rate%)       | budget.eu_contrib |
| Location (postcode)                                  | project_locations |
| Local enterprise partnership area                    | description       |
| Country                                              |                   |
| Type and focus support (category of intervention)    | themes            |
