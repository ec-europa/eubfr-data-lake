# 2014uk16rfop005 XLS ETL mapping rules

Model to compare with is available at: https://ec-europa.github.io/eubfr-data-lake/

| Field                                              | Target            |
| -------------------------------------------------- | ----------------- |
| Project Title                                      | title             |
| EU Programme                                       | programme_name    |
| Priority                                           | ec_priorities     |
| Project Description                                | description       |
| Lead Organisation                                  | third_parties     |
| Sector                                             | description       |
| Joint Sponsors                                     | third_parties     |
| Regional area(s)                                   | project_locations |
| Category of intervention                           | themes            |
| Project start date                                 | timeframe.from    |
| Project end date                                   | timeframe.to      |
| EU funds awarded                                   | budget.eu_contrib |
| Total Project cost                                 | budget.total_cost |
| Union co-financing rate, as per Priority Axis      | description       |
| Welsh Government Targeted Match Funding, Yes / No’ | description       |
| Case ID                                            | project_id        |
