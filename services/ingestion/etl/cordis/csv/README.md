# CORDIS ETL mapping

Model to compare with is available at: https://ec-europa.github.io/eubfr-data-lake/

| Field                | Target                |
| -------------------- | --------------------- |
| rcn                  | description           |
| id, reference        | project_id            |
| acronym              | description           |
| status               | status                |
| programme            | sub_programme_name    |
| topics               | description           |
| frameworkProgramme   | programme_name        |
| title                | title                 |
| startDate            | timeframe.from        |
| endDate              | timeframe.to          |
| projectUrl           | project_website       |
| objective            | description           |
| totalCost            | budget.total_cost     |
| ecMaxContribution    | budget.eu_contrib     |
| call                 | budget.mmf_heading    |
| fundingScheme        | funding_area          |
| coordinator          | third_parties.name    |
| coordinatorCountry   | third_parties.country |
| participants         | third_parties.name    |
| participantCountries | third_parties.country |
| subjects             |                       |
