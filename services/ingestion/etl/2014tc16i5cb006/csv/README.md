# 2014tc16i5cb006 CSV ETL mapping rules

Model to compare with is available at: https://ec-europa.github.io/eubfr-data-lake/

| Field                         | Target                           |
| ----------------------------- | -------------------------------- |
| Leading partner               | third_parties                    |
| Project title                 | title                            |
| Project code                  | project_id                       |
| Project call                  | description                      |
| Project start date            | timeframe.from                   |
| Project end date              | timeframe.to                     |
| Project final contract amount | budget.total_cost                |
| Project EU co-financing rate  | budget.eu_contrib                |
| Region                        | project_locations, third_parties |
| Country                       | project_locations, third_parties |
| Project intervention field    | description                      |
| Last modified                 | description                      |
