# 2014tc16m4tn002 XLS ETL mapping rules

Model to compare with is available at: https://ec-europa.github.io/eubfr-data-lake/

| Field                                            | Target                           |
| ------------------------------------------------ | -------------------------------- |
| Project Number/Codice del progetto               | project_id                       |
| Project acronym/Acronimo del progetto            | description                      |
| Title/Titolo                                     | title                            |
| LEAD PARTNER/ Nome del Capofila                  | third_parties                    |
| Participating Countries/Paesi partecipanti       | project_locations                |
| LP COUNTRY/Paese del LP                          | project_locations, third_parties |
| START DATE/Data di inizio                        | timeframe.from                   |
| END DATE/Data di fine                            | timeframe.to                     |
| OPERATION SUMMARY / Sintesi dell'operazione      | description                      |
| Intervention category/Categoria dell' operazione | themes                           |
| Total Budget/Spesa totale                        | budget.total_cost                |
| ERDF Contribution/FESR confinanziamento          | budget.eu_contrib                |
| IPA Contribution/IPA confinanziamento            |                                  |
