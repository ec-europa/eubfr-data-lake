# DEVCO ETL rules

Model to compare with is available at: https://ec-europa.github.io/eubfr-data-lake/

| Field                                                                                    | Target                             |
| ---------------------------------------------------------------------------------------- | ---------------------------------- |
| ID                                                                                       | project_id                         |
| Country                                                                                  | project_locations.country_code     |
| Region                                                                                   | project_locations.region           |
| Lead Financier                                                                           | devco_lead_investor                |
| Funding Source                                                                           | programme_name                     |
| Project Title                                                                            | title                              |
| CRIS No or ExCom Des                                                                     | devco_cris_number                  |
| Project Type                                                                             | type                               |
| Total Budget (Million Euro)                                                              | budget.total_cost                  |
| Investment Grant (Million Euro)                                                          | devco_investment_grant             |
| TA (Million Euro)                                                                        | devco_ta                           |
| Interest Rate Subsidy (Million Euro)                                                     | devco_interest_rate_subsidy        |
| Guarantee (Million Euro)                                                                 | devco_guarantee                    |
| Equity (Million Euro)                                                                    | devco_equity                       |
| Budget Support (Million Euro)                                                            | devco_budget_support               |
| Loan (Million Euro)                                                                      | devco_loan                         |
| Total EU Contribution (Million Euro)                                                     | budget.eu_contrib                  |
| Leverage                                                                                 | devco_leverage                     |
| 1.1 Access on grid electricity ('000 people)                                             | results, devco_results_indicators  |
| 1.2 Access mini grid electricity ('000 people)                                           | results ,devco_results_indicators  |
| 1.3 Access off-grid electricity ('000 people)                                            | results,devco_results_indicators   |
| 1.4 Inferred access (additional generation) ('000 people)                                | results,devco_results_indicators   |
| 1.5 Inferred access (cross-border transmission) ('000 people)                            | results ,devco_results_indicators  |
| 1.6 Access to biomass/biogas clean cooking ('000 people)                                 | results ,devco_results_indicators  |
| 1.7 Access to LPG/ethanol cooking ('000 people)                                          | results ,devco_results_indicators  |
| 1.8 Electricity from renewables (GWh/year)                                               | results ,devco_results_indicators  |
| 1.9 Renewable generation capacity (MW)                                                   | results ,devco_results_indicators  |
| 1.10 Electricity from energy efficiency (liberated capacity) (MW)                        | results,devco_results_indicators   |
| 1.11 Transmission lines (km)                                                             | results,devco_results_indicators   |
| 1.12 Distribution lines (km)                                                             | results ,devco_results_indicators  |
| 1.13 Energy Savings (MWh/year)                                                           | results , devco_results_indicators |
| 1.14 GHG emissions avoided per year (ktons CO2eq)                                        | results ,devco_results_indicators  |
| 1.15 No of direct jobs person/year (construction)                                        | results ,devco_results_indicators  |
| 1.16 No of permanent jobs (operation)                                                    | results ,devco_results_indicators  |
| 2.1 Direct and Inferred electricity access ('000 people)                                 | results ,devco_results_indicators  |
| 2.2 Clean cooking and fuel access ('000 people)                                          | results ,devco_results_indicators  |
| 2.3 Direct and Inferred access to energy ('000 people)                                   | results ,devco_results_indicators  |
| 2.4 Electricity from renewabes (GWh/year)                                                | results ,devco_results_indicators  |
| 2.5 Reneable generation capacity (MW)                                                    | results ,devco_results_indicators  |
| 2.6 Electricity generation capacity (MW)                                                 | results ,devco_results_indicators  |
| 2.7 Transmission and distribution lines (km)                                             | results,devco_results_indicators   |
| 2.8 GHG emissions avoided per year (ktons CO2eq)                                         | results ,devco_results_indicators  |
| 2.9 No of direct and permanent jons (construction and operation)                         | results ,devco_results_indicators  |
| BET1 (Access to energy)                                                                  | results ,devco_results_indicators  |
| BET2 (Renewable energy generation and energy efficiency)                                 | results ,devco_results_indicators  |
| BET3 (Contribution to the fight against climate change)                                  | results ,devco_results_indicators  |
| EURF 1 (No of people provided with access to electricity with EU support)                | results ,devco_results_indicators  |
| EURF 2 (Renewable energy production supported by the EU)                                 | results ,devco_results_indicators  |
| EURF 3 (GHG emission avoided)                                                            | results ,devco_results_indicators  |
| SDG 7.1.1 Percentage of population with access to electricity)                           | results ,devco_results_indicators  |
| SDG 7.1.2 (Proportion of population with primary reliance on clean fuels and technology) | results ,devco_results_indicators  |
| SDG 7.2.1 Renewable energy share in the total final energy consumption)                  | results ,devco_results_indicators  |
| SDG 7.3.1 (Energy intensity measured in terms of primary energy and GDP)                 | results ,devco_results_indicators  |
| SDG 8.3.1 (Proportion of informal employement in non-agriculture employment, by sex)     | results ,devco_results_indicators  |
| Description and main objectives                                                          | description                        |
| Project Stage                                                                            | devco_project_stage                |
| Contract Status                                                                          | status                             |
| Starting Date                                                                            | timeframe.from                     |
| Ending Date                                                                              | timeframe.to                       |
| Date of data entry                                                                       | devco_date_entry                   |
| For AREI Projects (Endorsement) Y/N                                                      | devco_arei_projects_endorsement    |
| Comments                                                                                 | comments                           |
