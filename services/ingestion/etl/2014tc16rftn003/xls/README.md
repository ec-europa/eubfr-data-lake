# 2014tc16rftn003 XLS ETL mapping rules

Model to compare with is available at: https://ec-europa.github.io/eubfr-data-lake/

| Field                                                                                                        | Target                           |
| ------------------------------------------------------------------------------------------------------------ | -------------------------------- |
| Index / Indice                                                                                               | project_id                       |
| Beneficiary name / Nom du bénéficiaire                                                                       | third_parties                    |
| Operation name / Acronyme du projet                                                                          | title                            |
| Approved / Approuvé                                                                                          | description                      |
| Operation summary / Résumé du projet                                                                         | description                      |
| Operation start date / Date de début du projet                                                               | timeframe.from                   |
| Operation end date / Date de fin du projet                                                                   | timeframe.to                     |
| Total eligible expenditure allocated to the operation / Montant total éligible attribué au projet            | budget.total_cost                |
| Union co-financing rate as per priority axes / Taux de cofinancement de l'UE selon le statut du bénéficiaire | budget.eu_contrib                |
| Operation post code / Code postal                                                                            | project_locations                |
| Country / Pays                                                                                               | project_locations, third_parties |
| Name of category of intervention / Nom de la catégorie d'intervention                                        | ec_priorities                    |
| Date of last update / Date de dernière mise à jour                                                           | description                      |
