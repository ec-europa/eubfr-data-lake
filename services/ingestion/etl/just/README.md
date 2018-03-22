# JUST ETL mapping

Date of document revision: 22/03/2018

Model to compare with is available at: https://ec-europa.github.io/eubfr-data-lake/

| Field                                | Source                       | Target                                                               |
| ------------------------------------ | ---------------------------- | -------------------------------------------------------------------- |
| Project Reference Number             | field_prj_ref_number         | project_id                                                           |
| Year                                 | field_prj_year               | @TBD: call_year or timeframe.from                                    |
| Title                                | title                        | title                                                                |
| Summary                              | field_prj_summary            | description                                                          |
| Comments                             | field_prj_comments           | @TBD: sub_programme_name or could be new or merge with description   |
| Lessons & Ideas                      | field_prj_lessons_ideas      | @TBD: success_story                                                  |
| Material Available                   | field_prj_material_available | media                                                                |
| Upload logo                          | field_prj_upload_logo        | media                                                                |
| Website                              | field_prj_website            | project_website                                                      |
| Actions                              | field_prj_cat_actions        | action                                                               |
| Beneficiaries                        | field_prj_cat_beneficiaries  | coordinators                                                         |
| Intermediaries                       | field_prj_cat_intermediaries | @TBD: Merge with coordinators                                        |
| Tools and products                   | field_prj_cat_tools_products | @TBD                                                                 |
| Topics                               | field_prj_cat_topics         | themes                                                               |
| Lead organisation                    | field_prj_org_lead           | @TBD: Merge with coordinators                                        |
| Partner(s)                           | field_prj_org_partner        | Partners                                                             |
| Associate Partner(s)                 | field_prj_org_associate      | Partners                                                             |
| Document                             | field_prj_document           | Media                                                                |
| Link                                 | field_prj_link               | related_links                                                        |
| Promote project to EU Results (BUDG) | field_prj_budg_promote       | @TBD: Not needed                                                     |
| Results                              | field_prj_results            | results                                                              |
| Country ISO Code                     | field_prj_country_iso        | project_locations[0].country_code                                    |
| Latitude                             | field_prj_latitude           | @TBD: project_locations[0].centroid or project.locations[0].location |
| Longitude                            | field_prj_longitude          | @TBD: project_locations[0].centroid or project.locations[0].location |
| End year                             | field_prj_end_year           | timeframe.to                                                         |
| EU budget contribution               | field_prj_eu_budget          | eu_contrib                                                           |
| Total project budget                 | field_prj_total_budget       | total_cost                                                           |
