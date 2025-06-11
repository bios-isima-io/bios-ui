# Features

### <a id="signal_features"></a>Signal Features

_Features_ allow computation of indexes and metrics (aggregations for numerical fields) using
_groupBy_ a set of hierarchical attributes called _dimensions_.  There is also an ability to
configure alerts on features.

```json
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
           "condition": "sum(reportedDeaths) > 1000",
           "webhookUrl": "https://webhook.site/99743393-3a47-473f-8676-319e8c5d9422"
         }
       ]
    }
  ]
}
```
| Property Name       | Description                                                                                                                                                                                                                                                          |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _featureName_       | Name of the feature. Names are case-insensitive. Alpha-numeric and special  characters are allowed. They must be unique for a <span style="font-family:Courier New;">signal</span>.                                                                                  |
| _dimensions_        | Set of signal attributes to be used for querying signal.  The dimensions are used for grouping and filtering metrics.  They also are used as index key when indexed.                                                                                                 |
| _attributes_        | Set of _attributes_ for which _metrics_ are computed                                                                                                                                                                                                                 |
| _metrics_           | The following metrics are supported <br/><br/> - _count_<br/> - _min_<br/> - _max_<br/> - _sum_<br/> - _avg_<br /> - _distinctcount_<br /><br/>Specific combination of metrics with attributes need to be configured ex: _sum(reportedCases)_, _max(reportedDeaths)_ |
| _featureInterval_   | Periodic interval in milliseconds for building the feature data                                                                                                                                                                                                      |
| _alertName_         | Name of the alert.  Names are case-insensitive. Alpha-numeric and special  characters are allowed. Alert names must be unique for a <span style="font-family:Courier New;">signal</span>.                                                                            |
| _condition_         | The condition that will be evaluated so that an alert can be sent                                                                                                                                                                                                    |
| _webhookUrl_        | The url of the webhook to which the generated alert will be posted                                                                                                                                                                                                   |
| _indexed_           | Whether the feature generates an index by the dimensions                                                                                                                                                                                                             |
| _timeIndexInterval_ | Periodic interval in milliseconds for updating indexes                                                                                                                                                                                                               |

### <a id="context_features"></a>Context Features

The _Features_ for a context configure  metrics (aggregations for numerical
fields) and indexes.

The following is an example of a feature that computes metrics (such as sum,
min, max, and avg) for attribute <span style="font-family:Courier New;
font-size:18px;">numProducts</span> and allows the aggregates to be grouped over
attribute <span style="font-family:Courier New;">zipCode</span>
.

```json
{
  "contextName": "contextWithFeature",
  "missingAttributePolicy": "Reject",
  "attributes": [
      {"attributeName": "storeId", "type": "Integer"},
      {"attributeName": "zipCode", "type": "Integer"},
      {"attributeName": "address", "type": "String"},
      {"attributeName": "numProducts", "type": "Integer"},
  ],
  "primaryKey": ["storeId"],
  "features": [
      {
          "featureName": "byZipCode",
          "dimensions": ["zipCode"],
          "attributes": ["numProducts"],
          "featureInterval": 15000,
          "aggregated": true,
          "indexed": true,
      }
  ]
}
```

The following is an example of an index on attribute <span
style="font-family:Courier New;">countryName</span> that allows
filtering by <span style="font-family:Courier New;
font-size:18px;">countryName</span> and retrieving <span
style="font-family:Courier New;">population</span> and <span
style="font-family:Courier New;">continent</span> for a given
set of countryName values -

```json
"features": [
  {
    "featureName": "indexByCountryName",
    "dimensions": ["countryName"],
    "attributes": ["population", "continent"],
    "dataSketches": [],
    "indexed": true,
    "indexType": "ExactMatch"
  }
]
```


| Property Name | Description                                                                                                                                                                                                                                                                                                      |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _featureName_ | Name of the feature. Names are case-insensitive. Alpha-numeric characters, and underscores for the second and later characters, are allowed. The name must be unique for the <span style="font-family:Courier New;">context</span>.                                                                              |
| _dimensions_  | Sequence of attributes as the composite key of the index. Queries can filter by these attributes. For aggregations, these attributes can be used in the <span style="font-family:Courier New;">groupBy</span> clause.                                                                                            |
| _attributes_  | Set of attributes that are stored in the index alongside the key values - these attributes can be retrieved by queries. For metrics, aggregations are computed for these attributes.                                                                                                                             |
| _indexed_     | Whether the feature generates an index by the dimensions.                                                                                                                                                                                                                                                        |
| indexType     | Type of the index. Possible values are -<br />- <span style="font-family:Courier New;">ExactMatch</span> - queries must specify an exact values of primary key.<br />- <span style="font-family:Courier New;">RangeQuery</span> - queries may specify either an exact value or a range of values of primary key. |
