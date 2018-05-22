# NUTS code Missing Query

This query will return all the documents that have null values for the **nuts** keys

Read more about the [missing query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-exists-query.html#_literal_missing_literal_query)

## Request

* Endpoint: `https://PROJECTS_INDEX/project/_search`
* Method: `POST`

```json
{
  "query": {
    "nested": {
      "path": "project_locations",
      "query": {
        "bool": {
          "must_not": {
            "exists": {
              "field": "project_locations.nuts"
            }
          }
        }
      }
    }
  }
}
```

## Response

```json
{
  "took": 26,
  "timed_out": false,
  "_shards": {
    "total": 5,
    "successful": 5,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": 170422,
    "max_score": 1.0,
    "hits": [
      {
        "_index": "test-projects",
        "_type": "project",
        "_id": "2f7ddfbf8eaea1cbc4f27906500d9092",
        "_score": 1.0,
        "_source": {
          ...
          "project_locations": [
            {
              "country_code": "FI",
              "region": "",
              "address": "Jokelantie 1654",
              "postal_code": "97675",
              "town": "Narkaus",
              "centroid": {
                "lat": 66.291843,
                "lon": 26.15794
              },
              "location": {
                "type": "Point",
                "coordinates": [26.15794, 66.291843]
              }
            }
          ],
          ...
          "title": "Title",
        }
      }
    ]
  }
}
```
