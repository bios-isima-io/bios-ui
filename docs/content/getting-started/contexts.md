# Contexts

<span style="font-family:Courier New;">Contexts</span> represent the current state of a system that can change/evolve. Examples of <span style="font-family:Courier New;">contexts</span> are mapping of
SKU to price, IP to geolocation, customer to the probability of churn, etc. They are fit for data sources that are -

* Mutable - Developers can frequently modify data within <span style="font-family:Courier New;">contexts</span>.
* Semi-voluminous - From hundreds to thousands of events/sec.

Refer below for an example of a <span style="font-family:Courier New;">context</span> -

```json
{
  "contextName": "userContext",
  "missingAttributePolicy": "Reject",
  "attributes": [
    {
      "attributeName": "id",
      "type": "Integer"
    },
    {
      "attributeName": "name",
      "type": "String",
      "missingAttributePolicy": "StoreDefaultValue",
      "default": "MISSING"
    },
    {
      "attributeName": "email",
      "type": "String"
    },
    {
      "attributeName": "gender",
      "type": "String"
    },
    {
      "attributeName": "status",
      "type": "String",
      "missingAttributePolicy": "StoreDefaultValue",
      "default": "MISSING"
    }
  ],
  "primaryKey": [
    "id"
  ],
  "missingLookupPolicy": "FailParentLookup",
  "enrichments": []
}
```
