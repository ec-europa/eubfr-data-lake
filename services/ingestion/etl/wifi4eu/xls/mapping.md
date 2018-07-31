# Producer: WIFI4EU

## DG: CNECT

## Format: xls

| Source                | Target                           | Operation               |
| :-------------------- | :------------------------------- | :---------------------- |
|                       | action                           | ''                      |
|                       | budget.total_cost                | sanitizeBudgetItem()    |
|                       | budget.eu_contrib                | sanitizeBudgetItem()    |
|                       | budget.private_fund              | sanitizeBudgetItem()    |
|                       | budget.public_fund               | sanitizeBudgetItem()    |
|                       | budget.other_contrib             | sanitizeBudgetItem()    |
|                       | budget.funding_area              | []                      |
|                       | budget.mmf_heading               | ''                      |
| 'Call year'           | call_year                        |                         |
| 'Project Description' | description                      |                         |
|                       | ec_priorities                    | []                      |
|                       | media                            | []                      |
|                       | programme_name                   | ''                      |
| 'municipality name'   | project_id                       | getProjectId()          |
| 'country'             | project_locations[].country_code | getCountryCode(country) |
| 'postal code'         | project_locations[].postal_code  | getCountryCode(country) |
| 'municipality name'   | project_locations[].town         | getCountryCode(country) |
| 'link'                | project_website                  | ''                      |
|                       | related_links                    | []                      |
|                       | reporting_organisation           | 'CNECT'                 |
|                       | results.available                | ''                      |
|                       | results.result                   | ''                      |
|                       | status                           | ''                      |
|                       | sub_programme_name               | ''                      |
|                       | success_story                    | ''                      |
|                       | themes                           | []                      |
| 'Date from'           | timeframe.from                   | formatDate()            |
|                       | timeframe.from_precision         | 'day'                   |
| 'Project Title'       | title                            |                         |
|                       | types                            | []                      |
