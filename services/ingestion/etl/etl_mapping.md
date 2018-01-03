| Name                         | Required | Type    | Notes | -> | Name                             | Required | Type   | Notes | ( ) | Direct mapping | Default value | Additional logic |
|------------------------------|----------|---------|-------|----|----------------------------------|----------|--------|-------|-----|----------------|---------------|------------------|
| PROJECTID                    | true     | Integer |       | -> | project_id                       | true     | String |       | ( ) |                |               |                  |
| SID                          |          | Integer |       | -> |                                  |          |        |       | ( ) |                |               |                  |
| Project_type                 |          | String  |       | -> | type                             |          | Array  |       | ( ) | true           |               |                  |
| Project_Timeframe_start_date |          |         |       | -> | timeframe.from                   |          |        |       | ( ) | true           |               |                  |
| Project_Timeframe_end_date   |          |         |       | -> | timeframe.to                     |          |        |       | ( ) | true           |               |                  |
| Period                       |          |         |       | -> | period                           |          |        |       | ( ) | true           |               |                  |
| Date_published               |          |         |       | -> |                                  |          |        |       | ( ) |                |               |                  |
| Project_name                 | true     | String  |       | -> | title                            | true     | String |       | ( ) |                |               |                  |
| Project_region               |          |         |       | -> | project_locations[].region       |          |        |       | ( ) |                |               |                  |
| Project_NUTS2_code           |          |         |       | -> | project_locations[].nuts2        |          |        |       | ( ) |                |               |                  |
| Project_country              |          |         |       | -> | project_locations[].country_code |          |        |       | ( ) |                |               |                  |
| Themes                       |          | String  |       | -> | themes                           | Array    |        |       | ( ) |                |               |                  |
| EU_Budget_contribution       |          |         |       | -> | budget.eu_contrib                |          |        |       | ( ) |                |               |                  |
| Total_project_budget         |          |         |       | -> | budget.total_cost                |          |        |       | ( ) |                |               |                  |
| quote                        |          |         |       | -> | description                      |          |        |       | ()  |                |               |                  |
| URL                          |          |         |       | -> | project_website                  |          |        |       | ()  |                |               |                  |
| Beneficiary                  |          |         |       | -> | partners[].name                  |          |        |       | ()  |                |               |                  |
| Beneficiary_address          |          |         |       | -> | partners[].address               |          |        |       | ()  |                |               |                  |
| Beneficiary_Post_Code        |          |         |       | -> | partners[].address               |          |        |       | ()  |                |               |                  |
| Beneficiary_City             |          |         |       | -> | partners[].address               |          |        |       | ()  |                |               |                  |
| Beneficiary_Country          |          |         |       | -> | partners[].country               |          |        |       | ()  |                |               |                  |
