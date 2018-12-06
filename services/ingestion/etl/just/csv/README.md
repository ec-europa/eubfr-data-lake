# JUST CSV ETL mapping rules

Model to compare with is available at: https://ec-europa.github.io/eubfr-data-lake/

| Field                                | Source                       | Target                         |
| ------------------------------------ | ---------------------------- | ------------------------------ |
| Project Reference Number             | field_prj_ref_number         | project_id                     |
| Year                                 | field_prj_year               | call_year, timeframe.from      |
| Title                                | title                        | title                          |
| Summary                              | field_prj_summary            | description                    |
| Comments                             | field_prj_comments           | Not needed, not to be used     |
| Lessons & Ideas                      | field_prj_lessons_ideas      | results                        |
| Material Available                   | field_prj_material_available | media                          |
| Upload logo                          | field_prj_upload_logo        | media                          |
| Website                              | field_prj_website            | project_website                |
| Actions                              | field_prj_cat_actions        | action                         |
| Beneficiaries                        | field_prj_cat_beneficiaries  | coordinators                   |
| Intermediaries                       | field_prj_cat_intermediaries | partners                       |
| Tools and products                   | field_prj_cat_tools_products | Not needed, not to be used     |
| Topics                               | field_prj_cat_topics         | themes                         |
| Lead organisation                    | field_prj_org_lead           | partners                       |
| Partner(s)                           | field_prj_org_partner        | partners                       |
| Associate Partner(s)                 | field_prj_org_associate      | partners                       |
| Document                             | field_prj_document           | media                          |
| Link                                 | field_prj_link               | related_links                  |
| Promote project to EU Results (BUDG) | field_prj_budg_promote       | publishable (new field)        |
| Results                              | field_prj_results            | results                        |
| Country ISO Code                     | field_prj_country_iso        | project_locations.country_code |
| Latitude                             | field_prj_latitude           | project_locations.centroid     |
| Longitude                            | field_prj_longitude          | project_locations.centroid     |
| End year                             | field_prj_end_year           | timeframe.to                   |
| EU budget contribution               | field_prj_eu_budget          | eu_contrib                     |
| Total project budget                 | field_prj_total_budget       | total_cost                     |
