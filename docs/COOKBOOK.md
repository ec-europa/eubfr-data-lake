# COOKBOOK

List recipe for developers

## Aggregate projects per computed key

```curl
curl -X POST
'https://YOUR-ES-INDEX/_search?pretty='
-d '{
  "size":0,
  "aggs":{
    "project_bucket":{
      "terms":{
        "field":"computed_key"
      }
    }
  }
  }'
  ```

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
          ...
          {
            "key": "PRODUCER/COMPUTED_KEY_2.xls.ndjson",
            "doc_count": 1999
          }
        ]
      }
    }
  }
  ```

  ## Aggregate projects per project_id then aggregate buckets per most_recent

  ```curl
  curl -X POST
  'https://YOUR-ES-INDEX/_search?pretty='
  -d '{
    "size": 0,
    "aggs": {
      "project_bucket": {
        "terms": {
          "field": "project_id.keyword"
          },
        "aggs": {
          "most_recent": {
            "top_hits": {
              "sort": [{
                "last_modified": {
                  "order": "desc"
                }
              }],
              "size": 1
            }
          }
        }
      }
    }
  }'
```

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
                                    "_index": "test-projects",
                                    "_type": "project",
                                    "_id": "UDIMI2EBEArC_LGPK27s",
                                    "_score": null,
                                    "_source": {...}
                                },
                                {...}
                            ]
                        }
                    }
                }
            ]
        }
    }
}
```