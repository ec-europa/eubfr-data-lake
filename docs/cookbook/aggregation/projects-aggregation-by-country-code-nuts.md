# Aggregate projects by location (Geo Centroid computing with NUTS code)

Similar to the regular [Geo Centroid Aggregation](./projects-aggregation-by-country-code.md), this example request will just add a query that checks if the field nuts exists for the record. Since we don't store NUTS0, results will include NUTS1 and above.

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
                          "description":
                            "<p>Poland’s railway line 354 between the stations of Poznań Główny, Chodzież and Piła Główna in the northern Wielkopolskie region is undergoing modernisation. Financed by the EU, the upgrades to the line will make it faster and easier for the 250 000 people living in the north of the Wielkopolskie region to reach Poznań by train.</p>",
                          "title":
                            "Faster railway connections in Poland’s Wielkopolskie region"
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
