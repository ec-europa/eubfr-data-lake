## Request

* Endpoint: `https://PROJECTS_INDEX/project/_search`
* Method: `POST`

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

## Response

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
