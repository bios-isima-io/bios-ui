# Indexes

Indexes allow querying <span style="font-family:Courier New;">signals</span> and <span style="font-family:Courier New;">contexts</span> across multiple hierarchical dimensions.[^50]

The example below defines an index of a <span style="font-family:Courier New;">signal</span> that records users' visits to an e-commerce site for browsing products represented via <span style="font-family:Courier New;">productId</span>. The index is a high-cardinality composite of attributes <span style="font-family:Courier New;">userId</span> and <span style="font-family:Courier New;">ipAddress</span>. A simple one-line JSON configuration enables real-time indexing on this <span style="font-family:Courier New;">signal</span> to answer questions such as “Give me *ID of products* browsed by a *user* grouped by *IP address*.”

```json
"postStorageStage": {
  "features": [
    {
      "featureName": "productIdByUserIdAndIPAddress",
      "dimensions": ["userId", "ipAddress"],
      "attributes": ["productId"],
      "featureInterval": 300000,
      "timeIndexInterval": 300000,
      "indexed": true
    }
  ]
}
```

The following is another example to define an index of a product catalog <span style="font-family:Courier New;">context</span> with primary key <span style="font-family:Courier New;">productId</span> that includes attributes <span style="font-family:Courier New;">name</span>, <span style="font-family:Courier New;">targetGender</span>, and <span style="font-family:Courier New;">targetAge</span>. The definition makes a composite index <span style="font-family:Courier New;">targetGender</span>, <span style="font-family:Courier New;">targetAge</span>. The index gives capability to answer questions such as “Give me *names of products* targeting *males* in *age between twenty and thirty*.”

```json
"features": [
  {
    "featureName": "indexByTarget",
    "dimensions": ["targetGender", "targetAge"],
    "attributes": ["name"],
    "dataSketches": [],
    "indexed": true,
    "indexType": "RangeQuery"
  }
]
```

[^50]: In <span style="font-family:Courier New;">SQL</span> parlance this represents the groupby clause. <br/>
