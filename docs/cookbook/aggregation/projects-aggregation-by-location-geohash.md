# Aggregate projects by location (Geohash Grid Aggregation)

This example shows how to aggregate projects by the `centroid` field in an attempt of doing a simple server side clustering. We make use of the _GeoHash grid Aggregation_ with a defined precision that goes from 1 to 12.

* Endpoint: `https://PROJECTS_INDEX/project/_search`
* Method: `POST`

## Request

```json
{
  "size": 0,
  "aggregations": {
    "locations": {
      "nested": {
        "path": "project_locations"
      },
      "aggregations": {
        "filtered": {
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
          },
          "aggregations": {
            "countries": {
              "geohash_grid": {
                "size": 500,
                "field": "project_locations.centroid",
                "precision": 10
              },
              "aggregations": {
                "centroid": {
                  "geo_centroid": {
                    "field": "project_locations.centroid"
                  }
                },
                "info": {
                  "reverse_nested": {},
                  "aggregations": {
                    "place": {
                      "top_hits": {
                        "size": 1,
                        "sort": [
                          {
                            "last_modified": {
                              "order": "desc"
                            }
                          }
                        ],
                        "_source": {
                          "includes": ["title", "description"]
                        }
                      }
                    }
                  }
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
  "aggregations": {
    "locations": {
      "doc_count": 195432,
      "filtered": {
        "doc_count": 90496,
        "countries": {
          "buckets": [
            {
              "key": "ezj5sfm10y",
              "doc_count": 10812,
              "centroid": {
                "location": {
                  "lat": 40.00280278734863,
                  "lon": -4.003103915601969
                },
                "count": 10812
              },
              "info": {
                "doc_count": 10726,
                "place": {
                  "hits": {
                    "total": 10726,
                    "max_score": null,
                    "hits": [
                      {
                        "_index": "test-projects",
                        "_type": "project",
                        "_id": "06949bcf046ffbb6420c08c23acccc8c",
                        "_score": null,
                        "_source": {
                          "description": "description",
                          "title": "Title"
                        },
                        "sort": [1519739025581]
                      }
                    ]
                  }
                }
              }
            }
          ]
        }
      }
    }
  }
}
```

## Result

![GeoHash grid Aggregation](./aggregation_geohash.gif)
