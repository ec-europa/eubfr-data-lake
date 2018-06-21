# Aggregate projects by location (Geo Centroid computing with NUTS code)

Similar to the regular [Geo Centroid Aggregation](./projects-aggregation-by-country-code.md), this example request will add a query that checks if the field **nuts** exists in the document. The Exists Query will match all non-null values.

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
          "must": {
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
      "doc_count": 2221,
      "filtered": {
        "doc_count": 1957,
        "countries": {
          "doc_count_error_upper_bound": 0,
          "sum_other_doc_count": 0,
          "buckets": [
            {
              "key": "PL",
              "doc_count": 360,
              "centroid": {
                "location": {
                  "lat": 52.09771807305515,
                  "lon": 19.025815883651376
                },
                "count": 360
              },
              "info": {
                "doc_count": 360,
                "place": {
                  "hits": {
                    "total": 360,
                    "max_score": null,
                    "hits": [
                      {
                        "_index": "test-projects",
                        "_type": "project",
                        "_id": "48bab4c5bba54ae7cd785c5f6b9030dd",
                        "_score": null,
                        "_source": {
                          "description": "<p>description</p>",
                          "title": "Title"
                        },
                        "sort": [1526477161103]
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
