# Enrichments

### <a id="signal_enrich"></a>Signal Enrichment

A _signal_ can be enriched with _attributes_ from a <span style="font-family:Courier New;">context</span> by using one of its attributes
(_foreignKey_) as a lookup. Any number of _enrichments_ can be configured

```json
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
  }
```
| Property Name         | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _missingLookupPolicy_ | Governs the behavior if the lookup into a <span style="font-family:Courier New;">context</span> results in an empty match.<br/><br/>This policy can be applied at global level (i.e. for all enrichments) and can be overridden for individual _enrichments_.<br/><br/>Allowed actions are -<br/> - _Reject_: <span style="font-family:Courier New;">insert</span> operation is rejected<br/> - _StoreFillInValue_: Use the configured fillIn value as a substitute |
| _enrichmentName_      | Name for the _enrichment_ which is unique for a _signal_                                                                                                                                                                                                                                                                                                                                                                                                            |
| _foreignKeys_         | The keys on which the _enrichment_ from <span style="font-family:Courier New;">context</span> is performed. Currently, only a single attribute is supported                                                                                                                                                                                                                                                                                                         |
| _contextName_         | Name of the <span style="font-family:Courier New;">context</span> with which the _enrichment_ is configured                                                                                                                                                                                                                                                                                                                                                         |
| _attributeName_       | The <span style="font-family:Courier New;">context</span> _attribute(s)_ that will be _enriched_ with the <span style="font-family:Courier New;">signal</span>                                                                                                                                                                                                                                                                                                      |
| _as_                  | The name to use for the _enriched_ attribute (within the <span style="font-family:Courier New;">signal</span>)                                                                                                                                                                                                                                                                                                                                                      |
| _fillIn_              | Value to be used in case of lookup into a <span style="font-family:Courier New;">context</span> results in an empty match and _missingLookupPolicy_ results in _StoreFillInValue_                                                                                                                                                                                                                                                                                   |

**Note**: _Enrichments_ can be chained in the sequence in which they are specified in configuration.
The default setting for bi(OS) is to allow a maximum of two levels of enriched attribute _chaining_.
