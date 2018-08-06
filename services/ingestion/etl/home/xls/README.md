# DG HOME XLS ETL rules

| Field                            | Target                                                                                  | Notes       |
| -------------------------------- | --------------------------------------------------------------------------------------- | ----------- |
| Project Call Id                  | sub_programme_name, funding_area                                                        |             |
| Project Number                   | project_id                                                                              | aggregation |
| Participant Legal Name           | third_parties.name, project_locations                                                   |             |
| Participant Role                 | third_parties.role                                                                      |             |
| Participant LE Country Code      | third_parties.participant.country, third_parties.coordinator.country, project_locations |             |
| Project PCOCO First Name         | third_parties.coordinator.name                                                          |             |
| Project PCOCO Last Name          | third_parties.coordinator.name                                                          |             |
| Project PCOCO Email              | third_parties.coordinator.email                                                         |             |
| Project Title                    | title                                                                                   |             |
| Project Abstract                 | description                                                                             |             |
| Project Start Date               | timeframe.from                                                                          |             |
| Project End Date                 | timeframe.to                                                                            |             |
| Project Duration                 | description                                                                             |             |
| Project Requested EU Contrib     | budget.eu_contrib                                                                       |             |
| Project Acronym                  | description                                                                             |             |
| Project Status                   | status                                                                                  |             |
| Proposal Free Keywords Uppercase | description                                                                             |             |
