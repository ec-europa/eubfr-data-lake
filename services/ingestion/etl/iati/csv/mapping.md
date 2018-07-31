# Producer: IATI

## DG: xx

## Format: csv

| Source                   | Target                           | Operation                   |
| ------------------------ | -------------------------------- | --------------------------- |
|                          | action                           | ''                          |
|                          | budget.total_cost                | sanitizeBudgetItem()        |
| 'total-Disbursement'     | budget.eu_contrib.value          | sanitizeValue()             |
| 'total-Expenditure'      | budget.eu_contrib.value          | value + sanitizeValue()     |
|                          | budget.eu_contrib.currency       | sanitizeBudgetItem()        |
|                          | budget.eu_contrib.raw            | '$currency $value'          |
|                          | budget.private_fund              | sanitizeBudgetItem()        |
|                          | budget.public_fund               | sanitizeBudgetItem()        |
|                          | budget.other_contrib             | sanitizeBudgetItem()        |
|                          | budget.funding_area              | []                          |
|                          | budget.mmf_heading               | ''                          |
|                          | call_year                        | ''                          |
| 'description'            | description                      |                             |
|                          | ec_priorities                    | []                          |
|                          | media                            | []                          |
|                          | programme_name                   | ''                          |
| 'title'                  | project_id                       | getProjectId()              |
| 'recipient-country-code' | project_locations[].country_code | getCountryCode(country)     |
|                          | project_website                  | ''                          |
|                          | related_links                    | []                          |
| 'reporting-org-ref'      | reporting_organisation           | getReportingOrganizations() |
|                          | results.available                | ''                          |
|                          | results.result                   | ''                          |
|                          | status                           | ''                          |
|                          | sub_programme_name               | ''                          |
|                          | success_story                    | ''                          |
|                          | themes                           | []                          |
|                          | third_parties                    | []                          |
| 'start-actual'           | timeframe.from                   | formatDate()                |
|                          | timeframe.from_precision         | 'day'                       |
| 'end-actual'             | timeframe.to                     | formatDate()                |
|                          | timeframe.to_precision           | 'day'                       |
| 'title'                  | title                            |                             |
|                          | types                            | []                          |
