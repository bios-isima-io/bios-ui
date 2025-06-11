# Signal Configuration

_Signal_ configuration consists of _attributes_, _missingAttributePolicy_, _enrichments_ and _features_ as
shown in the example below-

```json
signal_config = {
  "signalName": "covidDataSignal",
  "missingAttributePolicy": "Reject",
  "attributes": [
    {
      "attributeName": "reportedDate",
      "type": "string"
    },
    {
      "attributeName": "countryCode",
      "type": "string"
    },
    {
      "attributeName": "reportedCases",
      "type": "integer"
    },
    {
      "attributeName": "reportedDeaths",
      "type": "integer"
    }
  ],
  "enrich": {
    "missingLookupPolicy": "Reject",
    "enrichments": [
      {
        "enrichmentName": "countryJoin",
        "foreignKeys": [
          "countryCode"
        ],
        "missingLookupPolicy": "StoreFillInValue",
        "contextName": "countryContext",
        "contextAttributes": [
          {
            "attributeName": "name",
            "as": "countryName",
            "fillIn": "UNKNOWN"
          },
          {
            "attributeName": "population",
            "fillIn": "0"
          }
        ]
      }
    ]
  },
  "postStorageStage": {
    "features": [
      {
        "featureName": "by_country",
        "dimensions": [
          "countryCode"
        ],
        "attributes": [
          "reportedCases",
          "reportedDeaths"
        ],
        "metrics": [
          "count()",
          "sum(reportedCases)",
          "sum(reportedDeaths)"
        ],
        "rollupInterval": 300000,
         "alerts": [
           {
             "alertName": "alertWhenDeathsCross1000InADay",
             "condition": "(sum(reportedDeaths) > 1000)",
             "webhookUrl": "https://webhook.site/99743393-3a47-473f-8676-319e8c5d9422"
           }
         ]

      }
    ]
  }
}
```

