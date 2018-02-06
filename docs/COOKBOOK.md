# COOKBOOK

List recipe for developers

## Search queries

### Geo Query - Bounding box

#### Request

POST `https://PROJECTS_INDEX/project/_search`

with body:

```json
{
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
```

#### Response

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

## Aggregations

### Aggregate projects per computed key with a limit of 5 results

#### Request

POST `https://PROJECTS_INDEX/project/_search`

width body

```json
{
  "size": 0,
  "aggs": {
    "project_bucket": {
      "terms": {
        "field": "computed_key",
        "size": 5
      }
    }
  }
}
```

#### Response

```json
{
  "took": 29,
  "timed_out": false,
  "_shards": {
    "total": 5,
    "successful": 5,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": 72090,
    "max_score": 0,
    "hits": []
  },
  "aggregations": {
    "project_bucket": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 22100,
      "buckets": [
        {
          "key": "PRODUCER/COMPUTED_KEY.xls.ndjson",
          "doc_count": 4999
        },
        ...,
        {
          "key": "PRODUCER/COMPUTED_KEY_2.xls.ndjson",
          "doc_count": 1999
        }
      ]
    }
  }
}
```

### Aggregate projects per project_id then aggregate buckets per most_recent

#### Request

POST `https://PROJECTS_INDEX/project/_search`

```json
{
  "size": 0,
  "aggs": {
    "project_bucket": {
      "terms": {
        "field": "project_id"
      },
      "aggs": {
        "most_recent": {
          "top_hits": {
            "sort": [
              {
                "last_modified": {
                  "order": "desc"
                }
              }
            ],
            "size": 1
          }
        }
      }
    }
  }
}
```

#### Response

```json
{
    "took": 851,
    "timed_out": false,
    "_shards": {
        "total": 5,
        "successful": 5,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": 72090,
        "max_score": 0,
        "hits": []
    },
    "aggregations": {
        "project_bucket": {
            "doc_count_error_upper_bound": 10,
            "sum_other_doc_count": 72070,
            "buckets": [
                {
                    "key": "1030",
                    "doc_count": 2,
                    "most_recent": {
                        "hits": {
                            "total": 2,
                            "max_score": null,
                            "hits": [
                                {
                                    "_index": "name of the index",
                                    "_type": "project",
                                    "_id": "UDIMI2EBEArC_LGPK27s",
                                    "_score": null,
                                    "_source": { ... }
                                },
                                { ... }
                            ]
                        }
                    }
                }
            ]
        }
    }
}
```
