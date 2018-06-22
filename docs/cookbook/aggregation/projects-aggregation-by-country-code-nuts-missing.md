# Aggregate projects by location (Geo Centroid computing without NUTS code)

Similar to the regular [Geo Centroid Aggregation](./projects-aggregation-by-country-code.md), this example request will add a query that checks if the field **nuts** does not exist in the document. The must_not Exists Query will match all null values.

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
        "bool": {
          "must_not": {
            "exists": {
              "field": "project_locations.nuts"
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
      "aggregations": {
        "filtered": {
          "filter": {
            "geo_bounding_box": {
              "project_locations.centroid": {
                "top_left": [-5.976562500000001, 60.88770004207789],
                "bottom_right": [25.971679687500004, 35.9602229692967]
              }
            }
          },
          "aggregations": {
            "countries": {
              "terms": {
                "size": 100,
                "field": "project_locations.country_code"
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
      "doc_count": 295714,
      "filtered": {
        "doc_count": 93277,
        "countries": {
          "doc_count_error_upper_bound": 0,
          "sum_other_doc_count": 0,
          "buckets": [
            {
              "key": "ES",
              "doc_count": 11398,
              "centroid": {
                "location": {
                  "lat": 40.02624900550623,
                  "lon": -3.8724897734539434
                },
                "count": 11398
              },
              "info": {
                "doc_count": 11307,
                "place": {
                  "hits": {
                    "total": 11307,
                    "max_score": null,
                    "hits": [
                      {
                        "_index": "test-projects",
                        "_type": "project",
                        "_id": "191184867fd5a9d464f7c5012a0181f9",
                        "_score": null,
                        "_source": {
                          "description": "",
                          "title": "Title"
                        },
                        "sort": [1526477160478]
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
