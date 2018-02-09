# Aggregate projects per field and then aggregate buckets per field

This example shows how to aggregate projects per `project_id` field and then aggregate resulting buckets per `most_recent` field.

## Request

* Endpoint: `https://PROJECTS_INDEX/project/_search`
* Method: `POST`

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

## Response

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
