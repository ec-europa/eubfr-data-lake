# 2014tc16rfcb014 CSV ETL mapping rules

Model to compare with is available at: https://ec-europa.github.io/eubfr-data-lake/

| Field                                                      | Target                          |
| ---------------------------------------------------------- | ------------------------------- |
| Operation name                                             | title                           |
| Operation subprogramme                                     | sub_programme_name              |
| Operation priority axis                                    | ec_priorities                   |
| Intervention categories                                    | themes                          |
| Operation summary                                          | description                     |
| Operation start date                                       | timeframe.from                  |
| Operation end date                                         | timeframe.to                    |
| Total eligible expenditure allocated to the full operation | budget.total_cost               |
| Total Union co-financing allocated to the full operation   | budget.eu_contrib               |
| Beneficiary name                                           | third_parties                   |
| Beneficiary role                                           | third_parties                   |
| Total eligible expenditure allocated to the beneficiary    |                                 |
| Total Union co-financing allocated to the beneficiary      |                                 |
| Location indicator                                         | third_parties,project_locations |
| Country                                                    | third_parties,project_locations |
