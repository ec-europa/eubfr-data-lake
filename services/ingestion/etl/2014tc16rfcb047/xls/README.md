# 2014tc16rfcb047 XLS ETL mapping rules

Model to compare with is available at: https://ec-europa.github.io/eubfr-data-lake/

| Field                         | Target            |
| ----------------------------- | ----------------- |
| Status                        | status            |
| Theme                         | description       |
| Project Ref                   | project_id        |
| eMS Ref Num                   | description       |
| Beneficiary/Lead Partner Name | third_parties     |
| Operation/Project Name        | title             |
| Operation Start Date          | timeframe.from    |
| Operation End Date            | timeframe.to      |
| Operation/Project Summary     | description       |
| Committed Outputs             | description       |
| Total Project Cost (€)        | budget.total_cost |
| Total ERDF + Match (€)        | description       |
| Total ERDF Allocated (€)      | description       |
| Union Co-Financing Rate %     | budget.eu_contrib |
| Operation Postcode            | project_locations |
| Country                       | project_locations |
| Category of Intervention      | description       |
