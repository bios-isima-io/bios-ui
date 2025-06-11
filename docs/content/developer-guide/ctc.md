# Context-to-Context

These follow the same rules as above, except they are performed at select time.  <span style="font-family:Courier New;">Inner</span>,  <span style="font-family:Courier New;">Left-Outer</span>, <span style="font-family:Courier New;">Chained
(snowflake) joins</span>, and <span style="font-family:Courier New;">Unions</span> are possible with <span style="font-family:Courier New;">context-to-context</span> enrichments.

Refer below for an example context-to-context enrichment config -
```json
"enrichments": [
    {
        "enrichmentName": "category",
        "foreignKey": ["site", "productId"],
        "missingLookupPolicy": "StoreFillInValue",
        "enrichedAttributes": [
            {
                "value": "productToCategory.group",
                "as": "group",
                "fillIn": "NO_GROUP",
            },
            {
                "value": "productToCategory.categoryId",
                "as": "categoryId",
                "fillIn": 0,
            },
        ],
    }
]
```
