# EU Invest CSV ETL mapping rules

Model to compare with is available at: https://ec-europa.github.io/eubfr-data-lake/

| Field                | Target                 |
| -------------------- | ---------------------- |
| \_nid                | project_id             |
| \_title              | title                  |
| \_subtitle           | title                  |
| \_banner             | media                  |
| \_banner_copy        | media                  |
| \_about_this_project | description            |
| \_sector             | themes                 |
| \_background_info    | description            |
| \_coordinator        | third_parties          |
| \_external_links     | related_link           |
| \_eu_funding         | budget.eu_contrib      |
| \_partners           | third_parties          |
| \_timeframe          | timeframe              |
| \_download_docs      |                        |
| \_location           | locations              |
| \_visual             | media                  |
| \_images_copyright   | media                  |
| author               | reporting_organisation |
