|   | Legend                         |
|---|--------------------------------|
| x | Data provided                  |
| o | Data not provided, set to null |
|   | Data not provided              |


| Data lake |                    |               |     |   | AGRI | BUDG | INFOREGIO |
|-----------|--------------------|---------------|-----|---|------|------|-----------|
| 1         | computed_key       |               |     |   | x    | x    | x         |
| 1         | producer_id        |               |     |   | x    | x    | x         |
| 1         | last_modified      |               |     |   | x    | x    | x         |
| 1         | project_id         |               |     |   | x    | x    | x         |
| 1         | title              |               |     |   | x    | x    | x         |
| 0, 1      | cover_image        |               |     |   | x    |      |           |
| 0, 1      | programme_name     |               |     |   | x    | x    |           |
| 0, 1      | sub_programme_name |               |     |   |      | x    |           |
| 0, 1      | description        |               |     |   | x    | x    | x         |
| 0, 1      | status             |               |     |   |      | x    |           |
| 0, 1      | action             |               |     |   |      | x    |           |
| 0, n      | type               |               |     |   |      | x    | x         |
| 0, 1      | results            |               |     |   | x    | x    |           |
| 0, 1      |                    | available     |     |   | x    | x    |           |
| 0, 1      |                    | result        |     |   | x    | x    |           |
| 0, n      | ec_priorities      |               |     |   | x    |      |           |
| 0, n      | coordinators       |               |     |   | x    | x    |           |
| 0, 1      |                    | name          |     |   | x    | x    |           |
| 0, 1      |                    | type          |     |   | o    | x    |           |
| 0, 1      |                    | address       |     |   | o    | x    |           |
| 0, 1      |                    | region        |     |   | o    | x    |           |
| 0, 1      |                    | country       |     |   | o    | x    |           |
| 0, 1      |                    | website       |     |   | o    | x    |           |
| 0, 1      |                    | phone         |     |   | o    | o    |           |
| 0, 1      |                    | email         |     |   | o    | o    |           |
| 0, 1      | budget             |               |     |   | x    | x    | x         |
| 0, 1      |                    | total_cost    |     |   | o    | o    | x         |
| 0, 1      |                    | eu_contrib    |     |   | x    | x    | x         |
| 0, 1      |                    | private_fund  |     |   | o    | o    | o         |
| 0, 1      |                    | public_fund   |     |   | o    | o    | o         |
| 0, 1      |                    | other_contrib |     |   | o    | o    | o         |
| 0, 1      |                    | funding_area  |     |   | o    | o    | x         |
| 0, n      | partners           |               |     |   | x    | x    | x         |
| 0, 1      |                    | name          |     |   | x    | x    | x         |
| 0, 1      |                    | type          |     |   | o    | x    | o         |
| 0, 1      |                    | address       |     |   | o    | x    | x         |
| 0, 1      |                    | region        |     |   | o    | x    | o         |
| 0, 1      |                    | country       |     |   | o    | x    | x         |
| 0, 1      |                    | website       |     |   | o    | x    | o         |
| 0, n      | project_locations  |               |     |   | x    | x    | x         |
| 0, n      |                    | country_code  |     |   | x    | x    | x         |
| 0, 1      |                    | region        |     |   | o    | o    | x         |
| 0, 1      |                    | nuts2         |     |   | o    | o    | x         |
| 0, 1      |                    | address       |     |   | x    | o    | o         |
| 0, 1      |                    | postal_code   |     |   | x    | o    | o         |
| 0, 1      |                    | town          |     |   | x    | o    | o         |
| 0, n      |                    | location      |     |   | x    | x    | x         |
| 0, n      |                    |               | lat |   | o    | o    | o         |
| 0, n      |                    |               | lon |   | o    | o    | o         |
| 0, 1      | call_year          |               |     |   |      | x    |           |
| 0, 1      | period             |               |     |   |      |      | x         |
| 0, 1      | timeframe          |               |     |   | x    | x    | x         |
| 0, 1      |                    | from          |     |   | x    | x    | x         |
| 0, 1      |                    | to            |     |   | x    | x    | x         |
| 0, 1      | publication_date   |               |     |   |      |      | x         |
| 0, 1      | project_website    |               |     |   | x    | x    | x         |
| 0, n      | related_links      |               |     |   | x    |      |           |
| 0, 1      |                    | url           |     |   | x    |      |           |
| 0, 1      |                    | label         |     |   | x    |      |           |
| 0, 1      | success_story      |               |     |   |      | x    |           |
| 0, 1      | source             |               |     |   |      |      |           |
| 0, n      | themes             |               |     |   |      |      | x         |
