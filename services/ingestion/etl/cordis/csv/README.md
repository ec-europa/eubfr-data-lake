# CORDIS ETL mapping

Model to compare with is available at: https://ec-europa.github.io/eubfr-data-lake/

| Field                                         | Target                |
| --------------------------------------------- | --------------------- |
| rcn, RCN                                      | description           |
| id, reference, Contract Number                | project_id            |
| acronym, Project Acronym                      | description           |
| status                                        | status                |
| programme                                     | sub_programme_name    |
| topics                                        | description           |
| frameworkProgramme, Framework Programme (FP4) | programme_name        |
| title, Project Title                          | title                 |
| startDate, Start Date                         | timeframe.from        |
| endDate, End Date                             | timeframe.to          |
| projectUrl                                    | project_website       |
| objective                                     | description           |
| totalCost, Total Cost                         | budget.total_cost     |
| ecMaxContribution                             | budget.eu_contrib     |
| call                                          | budget.mmf_heading    |
| fundingScheme, Activity Area                  | funding_area          |
| coordinator                                   | third_parties.name    |
| coordinatorCountry                            | third_parties.country |
| participants                                  | third_parties.name    |
| participantCountries                          | third_parties.country |
| Keywords, Subject (FP4)                       | themes                |
| subjects                                      |                       |
| Duration (FP4)                                |                       |
| Date of Signature (FP4)                       |                       |
| Total Funding (FP4)                           |                       |
| Project Call (FP4)                            |                       |
| Contract Type (FP4)                           |                       |
| PGA                                           |                       |
| Coordinator Country                           |                       |
| Contractor Country                            |                       |
