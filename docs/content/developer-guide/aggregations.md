# Aggregations

bi(OS) auto-computes metrics such as <span style="font-family:Courier New;">min</span>, <span style="font-family:Courier New;">max</span>, <span style="font-family:Courier New;">sum</span>, <span style="font-family:Courier New;">avg</span>, <span style="font-family:Courier New;">distinctcount</span>, and <span style="font-family:Courier New;">count</span>  on any user-defined numeric column that is usually
grouped by a dimension column for exploratory analysis.  The example below defines an aggregate on a numerical
column <span style="font-family:Courier New;">elapsedTime</span>, grouped by a composite key consisting of columns <span style="font-family:Courier New;">eventType</span> and
<span style="font-family:Courier New;">geolocation</span> (non-numerical).

```json
{
  "featureName": "elapsedTimeByEventAndGeo",
  "dimensions": [
    "eventType",
    "geolocation"
  ],
  "attributes": [
    "elapsedTime"
  ],
  "featureInterval": 300000
}
```
