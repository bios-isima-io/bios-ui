# Context-to-Signal

<span style="font-family:Courier New;">Context-to-signal</span> enrichments are pre-insert and real-time. bi(OS) allows the enriched attributes to be used in
further enrichments, indexing, and aggregations.  <span style="font-family:Courier New;">Inner</span>,  <span style="font-family:Courier New;">Left-Outer</span>, and  <span style="font-family:Courier New;">Chained (snowflake)</span> type joins are
possible with <span style="font-family:Courier New;">context-to-signal</span> enrichments.

Refer below for an example context-to-signal enrichment config -
```json
"enrich": {
    "enrichments": [
      {
        "enrichmentName": "queueTaskDescription",
        "foreignKey": [
          "type"
        ],
        "missingLookupPolicy": "StoreFillInValue",
        "contextName": "queueTaskTypeContext",
        "contextAttributes": [
          {
            "attributeName": "description",
            "fillIn": "NA"
          }
        ]
      }
   ]
}
```
