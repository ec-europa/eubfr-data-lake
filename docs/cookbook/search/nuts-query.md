# NUTS Query

This query will return all the documents that have NUTS code details stored in the **nuts** key. For the document to match the query, nuts need to be a non-null value.

Read more about the [exists query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-exists-query.html)

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
  "took": 1,
  "timed_out": false,
  "_shards": {
    "total": 5,
    "successful": 5,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": 2221,
    "max_score": 1.0,
    "hits": [
      {
        "_index": "test-projects",
        "_type": "project",
        "_id": "5e3fb8b1b899860b2d031e8a55a4f335",
        "_score": 1.0,
        "_source": {
          ...
          "project_locations": [
            {
              "country_code": "FR",
              "region": "NORD-PAS-DE-CALAIS",
              "nuts": [
                {
                  "code": "FR3",
                  "name": "",
                  "level": null,
                  "year": null
                }
              ],
              ...
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
