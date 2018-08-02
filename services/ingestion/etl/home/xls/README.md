# DG HONE XLS ETL rules

| Field                            | Target                                  | Notes       |
| -------------------------------- | --------------------------------------- | ----------- |
| Project Call Id                  | budget.mmf_heading                      |             |
| Project Number                   | project_id                              | aggregation |
| Participant Legal Name           | "third_parties.name, project_locations" |             |
| Participant Role                 | third_parties.role                      |             |
| Participant LE Country Code      | third_parties.country                   |             |
| Project Title                    | title                                   |             |
| Project Start Date               | timeframe.from                          |             |
| Project End Date                 | timeframe.to                            |             |
| Project Duration                 | -                                       |             |
| Project Requested EU Contrib     | budget.eu_contrib                       |             |
| Project Acronym                  | description                             |             |
| Project Status                   | status                                  |             |
| Proposal Free Keywords Uppercase | description                             |             |
