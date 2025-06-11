# Materialization

bi(OS) allows certain auto-computed features to be refreshed into a <span style="font-family:Courier New;">context</span>. The materialized <span style="font-family:Courier New;">context</span> can then be used to enrich <span style="font-family:Courier New;">signals</span> and
<span style="font-family:Courier New;">contexts</span>, or queried. This capability enables services such as active
learning for recommendation systems, product inventory management, anomaly detection, and alerts. Below is an example which can help answering the following question[^53] [^55]  -

“Select *all products* sorted by *time* browsed by a *session* over *last 15 days* and keep it refreshed *every ~1 minute*
from *an unbounded table visits*.”

Note that insertions happen with quorum across 3 availability zones at 10’s
of thousands/sec, at 5 9’s reliability and the selects happen with a p99 latency < 10ms. In other words, materialization does not disturb event insertions.

```json
{
  "featureName": "productIdsBySessionId",
  "dimensions": [
    "SessionId"
  ],
  "attributes": [
    "productId"
  ],
  "materializedAs": "LastN",
  "featureInterval": 60000,
  "items": 15
}
```

Following is another example of materialization of a different type &mdash; <span style="font-family:Courier New;">AccumulatingCount</span>. The feature accumulates changes to the attribute values grouped by the dimensions[^54] [^55] .  The example answers following question -

“Select current *onHand* and *demand* counts identified by *warehouse ID* and *product ID*.”

```json
{
  "featureName": "counterSnapshots",
  "dimensions": ["warehouseId", "itemId", "operation"],
  "attributes": ["onHand", "demand"],
  "featureInterval": 5000,
  "materializedAs": "AccumulatingCount",
  "indexOnInsert": true,
}
```



[^53]: To achieve such an outcome typically you need a collection of Airbyte, Kafka, Flink, and Redis. <br/>
[^54]: The dimension <span style="font-family:Courier New;">operation</span> is a required special attribute that determines how the feature accumulates the count. Allowed values are <span style="font-family:Courier New;">change</span> and <span style="font-family:Courier New;">set</span>. When the operation is <span style="font-family:Courier New;">change</span>, the feature adds the attribute values to current counter snapshot in the context. For <span style="font-family:Courier New;">set</span>, the feature sets the attribute values to the context clearing the history of the values.<br/>
[^55]: The context is auto-created with name <span style="font-family:Courier New;">&lt;signalName&gt;_&lt;featureName&gt;</span>. Feature property <span style="font-family:Courier New;">featureAsContextName</span> overrides the name.
