# DEVCO ETL rules

Model to compare with is available at: https://ec-europa.github.io/eubfr-data-lake/

| Field                                                                                    | Target                         |
| ---------------------------------------------------------------------------------------- | ------------------------------ |
| ID                                                                                       | project_id                     |
| Country                                                                                  | project_locations.country_code |
| Region                                                                                   | project_locations.region       |
| Lead Financier                                                                           |                                |
| Funding Source                                                                           | programme_name                 |
| Project Title                                                                            | title                          |
| CRIS No or ExCom Des                                                                     |                                |
| Project Type                                                                             | type                           |
| Total Budget (Million Euro)                                                              | budget.total_cost              |
| Investment Grant (Million Euro)                                                          |                                |
| TA (Million Euro)                                                                        |                                |
| Interest Rate Subsidy (Million Euro)                                                     |                                |
| Guarantee (Million Euro)                                                                 |                                |
| Equity (Million Euro)                                                                    |                                |
| Budget Support (Million Euro)                                                            |                                |
| Loan (Million Euro)                                                                      |                                |
| Total EU Contribution (Million Euro)                                                     | budget.eu_contrib              |
| Leverage                                                                                 |                                |
| 1.1 Access on grid electricity ('000 people)                                             | results                        |
| 1.2 Access mini grid electricity ('000 people)                                           | results                        |
| 1.3 Access off-grid electricity ('000 people)                                            | results                        |
| 1.4 Inferred access (additional generation) ('000 people)                                | results                        |
| 1.5 Inferred access (cross-border transmission) ('000 people)                            | results                        |
| 1.6 Access to biomass/biogas clean cooking ('000 people)                                 | results                        |
| 1.7 Access to LPG/ethanol cooking ('000 people)                                          | results                        |
| 1.8 Electricity from renewables (GWh/year)                                               | results                        |
| 1.9 Renewable generation capacity (MW)                                                   | results                        |
| 1.10 Electricity from energy efficiency (liberated capacity) (MW)                        | results                        |
| 1.11 Transmission lines (km)                                                             | results                        |
| 1.12 Distribution lines (km)                                                             | results                        |
| 1.13 Energy Savings (MWh/year)                                                           | results                        |
| 1.14 GHG emissions avoided per year (ktons CO2eq)                                        | results                        |
| 1.15 No of direct jobs person/year (construction)                                        | results                        |
| 1.16 No of permanent jobs (operation)                                                    | results                        |
| 2.1 Direct and Inferred electricity access ('000 people)                                 | results                        |
| 2.2 Clean cooking and fuel access ('000 people)                                          | results                        |
| 2.3 Direct and Inferred access to energy ('000 people)                                   | results                        |
| 2.4 Electricity from renewabes (GWh/year)                                                | results                        |
| 2.5 Reneable generation capacity (MW)                                                    | results                        |
| 2.6 Electricity generation capacity (MW)                                                 | results                        |
| 2.7 Transmission and distribution lines (km)                                             | results                        |
| 2.8 GHG emissions avoided per year (ktons CO2eq)                                         | results                        |
| 2.9 No of direct and permanent jons (construction and operation)                         | results                        |
| BET1 (Access to energy)                                                                  | results                        |
| BET2 (Renewable energy generation and energy efficiency)                                 | results                        |
| BET3 (Contribution to the fight against climate change)                                  | results                        |
| EURF 1 (No of people provided with access to electricity with EU support)                | results                        |
| EURF 2 (Renewable energy production supported by the EU)                                 | results                        |
| EURF 3 (GHG emission avoided)                                                            | results                        |
| SDG 7.1.1 Percentage of population with access to electricity)                           | results                        |
| SDG 7.1.2 (Proportion of population with primary reliance on clean fuels and technology) | results                        |
| SDG 7.2.1 Renewable energy share in the total final energy consumption)                  | results                        |
| SDG 7.3.1 (Energy intensity measured in terms of primary energy and GDP)                 | results                        |
| SDG 8.3.1 (Proportion of informal employement in non-agriculture employment, by sex)     | results                        |
| Description and main objectives                                                          | description                    |
| Project Stage                                                                            |                                |
| Contract Status                                                                          | status                         |
| Starting Date                                                                            | timeframe.from                 |
| Ending Date                                                                              | timeframe.to                   |
| Date of data entry                                                                       |                                |
| For AREI Projects (Endorsement) Y/N                                                      |                                |
| Comments                                                                                 |                                |
