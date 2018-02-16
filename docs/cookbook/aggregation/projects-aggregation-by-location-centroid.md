# Aggregate projects by location (Geo Centroid Aggregation)

This example shows how to aggregate projects by the `centroid` field in an attempt of doing a simple server side clustering. We make use of the _Geo Centroid Aggregation_

* Endpoint: `https://PROJECTS_INDEX/project/_search`
* Method: `POST`

## Request

```json
{
  "size": 0,
  "query": {
    "nested": {
      "path": "project_locations",
      "query": {
        "constant_score": {
          "filter": {
            "geo_bounding_box": {
              "project_locations.centroid": {
                "top_left": {
                  "lat": 65.494,
                  "lon": -22.192
                },
                "bottom_right": {
                  "lat": 37.892,
                  "lon": 28.784
                }
              }
            }
          }
        }
      }
    }
  },
  "aggregations": {
    "locations": {
      "nested": {
        "path": "project_locations"
      },
      "aggs": {
        "countries": {
          "terms": {
            "field": "project_locations.country_code"
          },
          "aggs": {
            "centroid": {
              "geo_centroid": {
                "field": "project_locations.centroid"
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
"aggregations": {
  "locations": {
    "doc_count": 158,
    "countries": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 58,
      "buckets": [
        {
          "key": "BE",
          "doc_count": 12,
          "centroid": {
            "location": {
              "lat": 49.888557717204,
              "lon": 5.3766092984006
            },
            "count": 12
          }
        },
        {
          "key": "HU",
          "doc_count": 11,
          "centroid": {
            "location": {
              "lat": 47.463543887081,
              "lon": 19.826251053336
            },
            "count": 11
          }
        },
      ]
    }
  }
}
```

## Result

![Geo Centroid Aggregation](./aggregation_centroid.gif)
