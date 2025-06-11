# Context Configuration

_Context_ configuration consists of _attributes_, _missingAttributePolicy_ and _primaryKey_ as
shown in the example below (using python syntax).

```json
context_config = {
  "contextName": "countryContext",
  "missingAttributePolicy": "Reject",
  "attributes": [
    {
      "attributeName": "countryCode",
      "type": "string"
    },
    {
      "attributeName": "countryName",
      "type": "string",
      "missingAttributePolicy": "StoreDefaultValue",
      "default": "UNKNOWN"
    },
    {
      "attributeName": "population",
      "type": "integer"
    },
    {
      "attributeName": "continent",
      "type": "string",
      "allowedValues": [
        "Asia",
        "Africa",
        "Europe",
        "Australia",
        "North America",
        "South America",
        "Antarctica",
        "UnknownContinent"
      ],
      "missingAttributePolicy": "StoreDefaultValue",
      "default": "UnknownContinent"
    }
  ],
  "primaryKey": [
    "countryCode"
  ],
  "features": [
    {
      "featureName": "indexByCountryName",
      "dimensions": ["countryName"],
      "attributes": ["population", "continent"],
      "dataSketches": [],
      "indexed": true,
      "indexType": "RangeQuery"
    }
  ]
}
```
