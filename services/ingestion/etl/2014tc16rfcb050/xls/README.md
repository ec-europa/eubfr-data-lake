# 2014tc16rfcb050 XLS ETL mapping rules

Model to compare with is available at: https://ec-europa.github.io/eubfr-data-lake/

| Field                      | Target                           |
| -------------------------- | -------------------------------- |
| beneficiary name           | third_parties                    |
| role                       | third_parties                    |
| operation name             | title, project_id                |
| acronym                    | description                      |
| operation summary          | description                      |
| operation start date       | timeframe.from                   |
| operation end date         | timeframe.to                     |
| nutslabel                  | third_parties, project_locations |
| Country                    | third_parties, project_locations |
| beneficiary address        | third_parties                    |
| total eligible expenditure | budget.total_cost                |
| cofinancingrate            | description                      |
| ERDF                       | budget.eu_contrib                |
| investment priority        | ec_priorities                    |
