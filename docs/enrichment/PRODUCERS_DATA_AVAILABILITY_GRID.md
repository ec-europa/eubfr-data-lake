# Producers' location data availability grid

Below is a table with a list of producers and the data they provide (`×` marks the presence of that field)

| Producer  | format | example (stub)      | address | centroid | country_code | nuts | postal_code | region | town |
| --------- | ------ | ------------------- | ------- | -------- | ------------ | ---- | ----------- | ------ | ---- |
| AGRI      | csv    | [record.json][1]    | ×       | ×        | ×            |      | ×           |        | x    |
| CORDIS    | csv    | [record.json][2]    |         |          | x            |      |             |        |      |
| DEVCO     | xls    | [record.json][3]    |         |          | x            |      |             | x      |      |
| EAC       | csv    | [multiple stubs][4] |         |          | x            |      |             |        |      |
| FTS       | xls    | [record.json][5]    | x       |          | x            | x    | x           |        | x    |
| INFOREGIO | json   | [record.json][6]    |         |          | x            | x    |             | x      |      |
| INFOREGIO | xml    | [record.json][7]    |         |          | x            | x    |             | x      |      |
| WIFI4EU   | xls    | [record.json][8]    | x       |          | x            |      | x           |        | x    |
| IATI      | csv    | [record.json][9]    |         |          | x            |      |             |        |      |

[1]: https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/agri/csv/test/stubs/record.json
[2]: https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/cordis/csv/test/stubs/record.json
[3]: https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/devco/xls/test/stubs/record.json
[4]: https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/eac/csv/test/stubs
[5]: https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/fts/xls/test/stubs/record.json
[6]: https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/inforegio/json/test/stubs/record.json
[7]: https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/inforegio/xml/test/stubs/record.json
[8]: https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/wifi4eu/xls/test/stubs/record.json
[9]: https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/iati/csv/test/stubs/record.json
