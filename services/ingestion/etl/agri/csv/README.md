# AGRI CSV ETL mapping rules

Model to compare with is available at: https://ec-europa.github.io/eubfr-data-lake/

| Field                      | Target                 |
| -------------------------- | ---------------------- |
| Nid                        | project_id             |
| Original ID                |                        |
| Name                       | title                  |
| Project acronym            |                        |
| Visual                     | media                  |
| Project description        | description            |
| Results                    | results                |
| Coordinators               | third_parties          |
| Partners                   | third_parties          |
| Project address(es)        | locations              |
| Project postal code(s)     | locations              |
| Project town(s)            | locations              |
| Project country(ies)       | locations              |
| Project location latitude  | locations              |
| Project location longitude | locations              |
| Link to a video            | media                  |
| Timeframe start            | timeframe.from         |
| Timeframe end              | timeframe.to           |
| Project webpage            | project_website        |
| Related links              | related_links          |
| EU Budget MFF heading      | budget.mmf_heading     |
| Programme name             | programme_name         |
| Funding area               | funding_area           |
| EC’s priorities            | ec_priorities          |
| EU Budget contribution     | budget.eu_contrib      |
| Total project budget       | budget.total_cost      |
| Total project budget       | budget.total_cost      |
| Author                     | reporting_organisation |
| Language                   |                        |
