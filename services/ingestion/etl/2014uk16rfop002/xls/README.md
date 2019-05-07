# 2014uk16rfop002 XLS ETL mapping rules

Model to compare with is available at: https://ec-europa.github.io/eubfr-data-lake/

| Field                | Target            |
| -------------------- | ----------------- |
| Project No.          | description       |
| Project Name         | title             |
| Sponsor              | third_parties     |
| EU (£), EU (£) (30%) | budget.eu_contrib |
| GOG (£)              | description       |
| PS (£), PS (£) (70%) | description       |
| Total (£)            | budget.total_cost |
| Activity             | themes            |
| Start Date           | timeframe.from    |
| End Date             | timeframe.to      |
