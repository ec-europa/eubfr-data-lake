# Geo Query - Bounding box

This query will facilitate you in visualizing geo information on maps.

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
          "must": {
            "match_all": {}
          },
          "filter": {
            "geo_bounding_box": {
              "project_locations.centroid": {
                "top_left": {
                  "lat": 41,
                  "lon": -74
                },
                "bottom_right": {
                  "lat": 40,
                  "lon": -71
                }
              }
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
  "took": 8,
  "timed_out": false,
  "_shards": {
    "total": 5,
    "successful": 5,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": 2,
    "max_score": 1,
    "hits": [
      {
        "_index": "name of the index",
        "_type": "project",
        "_id": "id of the first hit",
        "_score": 1,
        "_source": { ... }
      },
      {
        "_index": "name of the index",
        "_type": "project",
        "_id": "id of the second hit",
        "_score": 1,
        "_source": { ... }
      }
    ]
  }
}
```
