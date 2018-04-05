# ETLs data availability grid

Below is a table with a list of producers and the data they provide (`×` marks the presence of that field)

|           | format |     | ingestion             | country | region | postal_code | locality | street | nuts | lat/long |
| --------- | ------ | --- | --------------------- | ------- | ------ | ----------- | -------- | ------ | ---- | -------- |
| AGRI      | .csv   |     | [sample](#agri1)      | ×       | ×      | ×           | ×        | ×      |      | ×        |
| BUDG      | .xls   |     | [sample](#budg1)      | ×       | ×      |             |          | ×      |      |          |
| INFOREGIO | .json  |     | [sample](#inforegio1) | ×       | ×      |             |          |        | ×    |          |
| INFOREGIO | .xls   |     | [sample](#inforegio2) | ×       |        | ×           | ×        | ×      |      | ×        |
| VALOR     | .xls   |     | [sample](#valor1)     | ×       | ×      |             |          | ×      |      |          |
| WIFI4EU   | .xls   |     | [sample](#wifi4eu1)   | ×       |        | ×           | ×        | ×      |      |          |

## Sample data and their exceptions

### <a name="agri1"></a>1. AGRI (.csv)

```json
{
  "Project address(es)": "Kalevi 13.",
  "Project postal code(s)": "50103",
  "Project town(s)": "Tartu",
  "Project country(ies)": "EE",
  "Project location latitude": "58.374614000000",
  "Project location longitude": "26.728486000000"
}
```

exceptions: multiple countries

```json
{
  "Project country(ies)": "FR;DE;DK;SE;BE;NL;UK;IT",
  "Project location latitude":
    "51.512323000000;50.835494000000;55.680346000000;48.861548000000;41.898743000000;52.081973000000;59.332504000000;52.516235000000",
  "Project location longitude":
    "-0.127697000000;4.361198000000;12.563584000000;2.350989000000;12.494792000000;4.304030000000;18.061970000000;13.298101000000"
}
```

### <a name="budg1"></a>2. BUDG (.xls)

```json
{
  "Participating countries": "IT,IE,DE,RO,HU,SE,FR,SI,DK,ES,UK,PL,AT,FI,BE",
  "Coordinator's address": "VIA MATTEOTTI 16, 40129, BOLOGNA",
  "Coordinator's region": "Emilia-Romagna",
  "Coordinator's country": "IT",
  "Partner 1 address": "HYNES BUILDING, ST CLARKS WALK, MERCHANTS ROAD, GALWAY",
  "Partner 1 region": "Extra-Regio NUTS 3",
  "Partner 1 country": "IE"
}
```

### <a name="inforegio1"></a>3. INFOREGIO (.json)

```json
{
  "project region": "Campania",
  "project nuts2 code": "ITF3",
  "project country": "IT"
}
```

### <a name="inforegio2"></a>4. INFOREGIO (.xls)

```json
{
  "Project address(es)": "Metropolitan JSC, 121 Kniaz Boris І str.",
  "Project postal code(s)": "BG-1000",
  "Project town(s)": "Sofia",
  "Project country(ies)": "BG",
  "Project latitude(s)": "42.73806663",
  "Project longitude(s)": "23.40014509"
}
```

exceptions: multiple countries

```json
{
  "Project address(es)":
    "AXEGA (Axencia Galega de Emerxencias), Roma, 25/27-1º",
  "Project postal code(s)": "15703",
  "Project town(s)": "Santiago de Compostella",
  "Project country(ies)": "ES;ES;PT",
  "Project latitude(s)": "40.45834289999999",
  "Project longitude(s)": "-3.6893450999999686"
}
```

### <a name="valor1"></a>5. VALOR (.xls)

```json
{
  "Coordinator's address": "8 rue Françoise d'Eaubonne, 31200, TOULOUSE",
  "Coordinator's region": "Midi-Pyrénées",
  "Coordinator's country": "FR",
  "Partner 1 address": "",
  "Partner 1 region": "",
  "Partner 1 country": ""
}
```

### <a name="wifi4eu1"></a>6. WIFI4EU (.xls)

```json
{
  "municipality name": "Buje",
  "address": "Istarska",
  "address num": "2",
  "postal code": "52460",
  "country": "HRVATSKA"
}
```

exceptions: non-latin characters, wrong address number

```json
{
  "municipality name": "Неделино-Nedelino",
  "address": "104 Aleksandar Stamboliyski Str.",
  "address num": "+359 307 292 92",
  "postal code": "4990",
  "country": "БЪЛГАРИЯ (BULGARIA)"
}
```
