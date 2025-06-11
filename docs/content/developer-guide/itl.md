# IngestTimeLag

<span style="font-family:Courier New;">IngestTimeLag</span> is a special kind of enrichment that tracks the delay between the time an event was emitted (by a source) and the time it was ingested by bi(OS). To enable this enrichment, bi(OS) requires the following  -
* <span style="font-family:Courier New;">ingestTimeLagName</span> - Name given to this enrichment.
* <span style="font-family:Courier New;">attribute</span> - Timestamp  attribute  in the source event that contains the emit time.
* <span style="font-family:Courier New;">as</span>  - The enriched attribute name in the <span style="font-family:Courier New;">signal</span>.
* <span style="font-family:Courier New;">tags</span> - Tags associated with the enriched attribute
  * <span style="font-family:Courier New;">category</span> - will default to Quantity.
  * <span style="font-family:Courier New;">kind</span> - will default to Duration.
  * <span style="font-family:Courier New;">unit</span> - will default to Millisecond.

Refer below for an example configuration to enable IngestTimeLag -
```json
"enrich": {
    "enrichments": [
      {
        "enrichmentName": "queueTaskDescription",
        "foreignKey": [
          "type"
        ],
        "missingLookupPolicy": "StoreFillInValue",
        "contextName": "QueueTaskTypeContext",
        "contextAttributes": [
          {
            "attributeName": "description",
            "fillIn": "NA"
          }
        ]
      }
   ],
   "ingestTimeLag": [
      {
        "ingestTimeLagName": "queueDelay",
        "attribute": "eventTimeStamp",
        "as": "queueDelay",
        "tags": {
          "category": "Quantity",
          "kind": "Duration",
          "unit": "Millisecond"
        }
      }
   ]
}
```
