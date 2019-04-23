# EU member state: Bulgaria, XLS ETL mapping rules

Model to compare with is available at: https://ec-europa.github.io/eubfr-data-lake/

| Field                                                 | Target                         |
| ----------------------------------------------------- | ------------------------------ |
| Beneficiary Name                                      | third_parties                  |
| Operation Name                                        | title                          |
| Summary of the Operation                              | description                    |
| Operation Start Date                                  | timeframe.from                 |
| Date of Completion of the Operation                   | timeframe.to                   |
| Total Eligible Costs Granted for the Operation        | budget.total_cost              |
| % of EC co-financing                                  | budget.eu_contrib              |
| Location                                              | project_locations.country_code |
| Name of Categories of Interventions for the Operation |                                |
| Date of Last Update of the List of Operations themes  |                                |
