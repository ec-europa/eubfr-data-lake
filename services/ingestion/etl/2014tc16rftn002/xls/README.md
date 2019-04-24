# 2014tc16rftn002 XLS ETL mapping rules

Model to compare with is available at: https://ec-europa.github.io/eubfr-data-lake/

| Field                         | Target                           |
| ----------------------------- | -------------------------------- |
| Operation code nr.            | project_id                       |
| Acronym                       | description                      |
| Operation name                | title                            |
| Summary                       | description                      |
| Start date                    | timeframe.from                   |
| End data                      | timeframe.to                     |
| Total of eligible expenditure | budget.total_cost                |
| ERDF expenditure allocated    | budget.eu_contrib                |
| Programme specific objective  | themes                           |
| Lead partner name             | third_parties                    |
| Lead partner location region  | third_parties                    |
| Country                       | project_locations, third_parties |
