# FTS XLS ETL rules

| Field                                  | Target                                    |
| -------------------------------------- | ----------------------------------------- |
| Reference of the Legal Commitment (LC) | project_id?                               |
| Commitment position key                | sub_programme_name                        |
| Year                                   | call_year                                 |
| Name of beneficiary                    | third_parties                             |
| Type                                   | type                                      |
| Coordinator                            | third_parties                             |
| VAT Number of beneficiary              | -                                         |
| Address                                | project_locations                         |
| City                                   | project_locations                         |
| Postal code                            | project_locations                         |
| Country / Territory                    | project_locations                         |
| Amount                                 | budget.eu_contrib                         |
| Source of (estimated) detailed amount  | -                                         |
| NUTS2                                  | project_locations                         |
| Geographical Zone                      | project_locations                         |
| Expense Type                           | new field: budget.type?                   |
| Total amount                           | budget.total_cost                         |
| Subject of grant or contract           | budget.mmf_heading or budget.funding_area |
| Responsible Department                 | reporting_organisation                    |
| Budget line name and number            | description                               |
| Action Type                            | programme_name                            |
| Funding Type                           | type                                      |
| LE Acct Group Code                     |                                           |
| LE Acct Group Desc                     |                                           |
