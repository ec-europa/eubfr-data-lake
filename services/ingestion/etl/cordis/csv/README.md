# CORDIS ETL mapping

Model to compare with is available at: https://ec-europa.github.io/eubfr-data-lake/

| Field                | Target                |
| -------------------- | --------------------- |
| rcn                  |                       |
| id                   | project_id            |
| acronym              |                       |
| status               | status                |
| programme            | sub_programme_name    |
| topics               |                       |
| frameworkProgramme   | programme_name        |
| title                | title                 |
| startDate            | timeframe.from        |
| endDate              | timeframe.to          |
| projectUrl           | project_website       |
| objective            | description           |
| totalCost            | budget.totalCost      |
| ecMaxContribution    | budget.eu_contrib     |
| call                 |                       |
| fundingScheme        |                       |
| coordinator          | third_parties.name    |
| coordinatorCountry   | third_parties.country |
| participants         |                       |
| participantCountries |                       |
| subjects             |                       |
