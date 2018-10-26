# DEVCO ETL rules

Model to compare with is available at: https://ec-europa.github.io/eubfr-data-lake/

| Field                                                             | Target                         |
| ----------------------------------------------------------------- | ------------------------------ |
| ID                                                                | project_id                     |
| Country                                                           | project_locations.country_code |
| Region                                                            | project_locations.region       |
| Lead Financier                                                    |                                |
| Funding Source                                                    | programme_name                 |
| Project Title                                                     | title                          |
| CRIS No or ExCom Des                                              |                                |
| Project Type                                                      | type                           |
| Total Budget\n(Million Euro)                                      | budget.total_cost              |
| Investment Grant (Million Euro)                                   |                                |
| TA (Million Euro)                                                 |                                |
| Interest Rate Subsidy \n(Million Euro)                            |                                |
| Guarantee (Million Euro)                                          |                                |
| Equity (Million Euro)                                             |                                |
| Budget Support (Million Euro)                                     |                                |
| Loan (Million Euro)                                               |                                |
| Total EU Contribution \n(Million Euro)                            | budget.eu_contrib              |
| Leverage                                                          |                                |
| 1.1 Access on grid electricity ('000 people)                      | results                        |
| 1.2 Access mini grid electricity ('000 people)                    | results                        |
| 1.3 Access off-grid electricity ('000 people)                     | results                        |
| 1.4 Inferred access (additional generation) ('000 people)         | results                        |
| 1.5 Inferred access (cross-border transmission) ('000 people)     | results                        |
| 1.6 Access to biomass/biogas clean cooking ('000 people)          | results                        |
| 1.7 Access to LPG/ethanol cooking ('000 people)                   | results                        |
| 1.8 Electricity from renewables (GWh/year)                        | results                        |
| 1.9 Renewable generation capacity (MW)                            | results                        |
| 1.10 Electricity from energy efficiency (liberated capacity) (MW) | results                        |
| 1.11 Transmission lines (km)                                      | results                        |
| 1.12 Distribution lines (km)                                      | results                        |
| 1.13 Energy Savings (MWh/year)                                    | results                        |
| 1.14 GHG emissions avoided per year (ktons CO2eq)                 | results                        |
| 1.15 No of direct jobs person/year (construction)                 | results                        |
| 1.16 No of permanent jobs \n(operation)                           | results                        |
| Description and main objectives                                   | description                    |
| Project Stage                                                     |                                |
| Contract Status                                                   | status                         |
| Starting Date                                                     | timeframe.from                 |
| Ending Date                                                       | timeframe.to                   |
| For AREI Projects (Endorsement) Y/N                               |                                |
| GIS Localisation                                                  | project_locations.centroid     |
| Comments                                                          |                                |
