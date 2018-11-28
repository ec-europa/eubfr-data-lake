# FTS XLS ETL mapping rules

Model to compare with is available at: https://ec-europa.github.io/eubfr-data-lake/

| Field                                  | Target                 |
| -------------------------------------- | ---------------------- |
| Reference of the Legal Commitment (LC) | -                      |
| Commitment position key                | project_id             |
| Year                                   | call_year              |
| Name of beneficiary                    | third_parties          |
| Type                                   | budget.funding_area    |
| Coordinator                            | third_parties          |
| VAT Number of beneficiary              | -                      |
| Address                                | project_locations      |
| City                                   | project_locations      |
| Postal code                            | project_locations      |
| Country / Territory                    | project_locations      |
| Amount                                 | -                      |
| Source of (estimated) detailed amount  | -                      |
| NUTS2                                  | project_locations      |
| Geographical Zone                      | project_locations      |
| Expense Type                           | -                      |
| Total amount                           | budget.eu_contrib      |
| Subject of grant or contract           | title                  |
| Responsible Department                 | reporting_organisation |
| Budget line name and number            | description            |
| Action Type                            | programme_name         |
| Funding Type                           | budget.funding_area    |
| LE Acct Group Code                     | -                      |
| LE Acct Group Desc                     | -                      |
