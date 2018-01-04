| Name                         | Required | Type   | Notes |   | Name                             | Required | Type     | Notes | () | Direct mapping | Default value | Additional logic             |
|------------------------------|----------|--------|-------|---|----------------------------------|----------|----------|-------|----|----------------|---------------|------------------------------|
| PROJECTID                    | true     | String |       | > | project_id                       | true     | String   |       | () |                |               |                              |
| SID                          |          | String |       |   |                                  |          |          |       | () |                |               |                              |
| Project_type                 |          | String |       | > | type                             |          | String[] |       | () | true           |               |                              |
| Project_Timeframe_start_date |          | String |       | > | timeframe.from                   |          | Date     |       | () | true           |               |                              |
| Project_Timeframe_end_date   |          | String |       | > | timeframe.to                     |          | Date     |       | () | true           |               |                              |
| Period                       |          | String |       | > | period                           |          | String   |       | () | true           |               |                              |
| Date_published               |          | String |       |   |                                  |          |          |       | () |                |               |                              |
| Project_name                 | true     | String |       | > | title                            | true     | String   |       | () |                |               |                              |
| Project_region               |          | String |       | > | project_locations[].region       |          | String   |       | () |                |               |                              |
| Project_NUTS2_code           |          | String |       | > | project_locations[].nuts2        |          | String   |       | () |                |               |                              |
| Project_country              |          | String |       | > | project_locations[].country_code |          | String   |       | () |                |               |                              |
| Themes                       |          | String |       | > | themes                           |          | String[] |       | () |                |               |                              |
| EU_Budget_contribution       |          | String |       | > | budget.eu_contrib                |          | String   |       | () |                |               | 'EUR 1 500 000' -> '1500000' |
| Total_project_budget         |          | String |       | > | budget.total_cost                |          | String   |       | () |                |               |                              |
| quote                        |          | String |       | > | description                      |          | String   |       | () |                |               |                              |
| URL                          |          | String |       | > | project_website                  |          | String   |       | () |                |               |                              |
| Beneficiary                  |          | String |       | > | partners[].name                  |          | String   |       | () |                |               |                              |
| Beneficiary_address          |          | String |       | > | partners[].address               |          | String   |       | () |                |               |                              |
| Beneficiary_Post_Code        |          | String |       | > | partners[].address               |          | String   |       | () |                |               |                              |
| Beneficiary_City             |          | String |       | > | partners[].address               |          | String   |       | () |                |               |                              |
| Beneficiary_Country          |          | String |       | > | partners[].country               |          | String   |       | () |                |               |                              |
